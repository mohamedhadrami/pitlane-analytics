import React, { useEffect, useMemo, useState } from "react";
import { Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { DriverParams, IntervalParams, LapParams, PositionParams, StintParams } from "../../interfaces/openF1";
import SectorSegment from "./SectorSegments";
import { getCompoundComponent } from "../../components/Tyres";
import { formatSecondsToTime } from "../../utils/helpers";
import Loading from "../../components/Loading";
import { useLiveSettings } from "./LiveSettingsContext";

const headers = [
    { name: "Position", uid: "position" },
    { name: "Gap", uid: "gap" },
    { name: "Tyre", uid: "tyre" },
    //{ name: "Lap", uid: "lap" },
    { name: "Lap Time", uid: "lapTime" },
    { name: "Sectors", uid: "sectors" }
];

interface LiveTimingProps {
    drivers: DriverParams[];
    stints: StintParams[];
    laps: LapParams[];
    positions: PositionParams[];
    intervals: IntervalParams[];
}

const LiveTiming: React.FC<LiveTimingProps> = ({ drivers, stints, laps, positions, intervals }) => {
    const { settings } = useLiveSettings();

    const defaultSettings = {
        showFastestLap: true,
        showTyre: true,
        showGapToLeader: true,
        showStintNumber: true,
    };

    const [isShowFastestLap, setIsShowFastestLap] = useState(defaultSettings.showFastestLap);
    const [isShowTyre, setIsShowTyre] = useState(defaultSettings.showTyre);
    const [isShowGapToLeader, setIsShowGapToLeader] = useState(defaultSettings.showGapToLeader);
    const [isShowStintNumber, setIsShowStintNumber] = useState(defaultSettings.showStintNumber);

    useEffect(() => {
        const findSetting = (name: string) => settings.find(setting => setting.name === name)?.value;

        setIsShowFastestLap(findSetting('Show Fastest Lap') ?? defaultSettings.showFastestLap);
        setIsShowTyre(findSetting('Show Tyre') ?? defaultSettings.showTyre);
        setIsShowGapToLeader(findSetting('Show Gap To Leader') ?? defaultSettings.showGapToLeader);
        setIsShowStintNumber(findSetting('Show Stint Number') ?? defaultSettings.showStintNumber);
    }, [settings]);

    const [sortedDrivers, setSortedDrivers] = useState<DriverParams[]>([]);
    const [currentLap, setCurrentLap] = useState<number | undefined>(0);

    useEffect(() => {
        const recentPositions = drivers.map(driver => {
            const driverPositions = positions.filter(position => position.driver_number === driver.driver_number);
            return { driver, position: driverPositions.pop()?.position || 0 };
        });

        const sorted = recentPositions.sort((a, b) => a.position - b.position).map(item => item.driver);
        setSortedDrivers(sorted);
    }, [drivers, positions]);

    useEffect(() => {
        const leaderPosition = positions.find(position => position.position === 1);
        const leaderLap = laps.find(lap => lap.driver_number === leaderPosition?.driver_number)?.lap_number;
        setCurrentLap(leaderLap);
    }, [laps, positions]);

    const classNames = useMemo(
        () => ({
            th: ["bg-transparent text-foreground text-sm font-extralight border-b border-divider"],
            tr: ["rounded-full border-b-1 border-default-300 last:border-none"],
            td: ["text-foreground !bg-black"],
            table: ["rounded-xl bg-black"]
        }),
        [],
    );

    const renderCell = (driver: DriverParams, columnKey: React.Key, laps: LapParams[], stints: StintParams[]) => {
        const lap = laps?.filter(lap => lap.driver_number === driver.driver_number).pop();
        const fastestLap = laps
            .filter(lap => lap.driver_number === driver.driver_number && lap.lap_duration !== 0)
            .reduce((fastest: LapParams | null, current) => {
                if (current.lap_duration == null) {
                    return fastest;
                }
                return !fastest || (current.lap_duration < fastest.lap_duration!) ? current : fastest;
            }, null);

        switch (columnKey) {
            case "position":
                const position = positions.filter(position => position.driver_number === driver.driver_number).pop()?.position;
                if (position == 1) {
                    setCurrentLap(lap?.lap_number)
                }
                return (
                    <div className="flex justify-center gap-1">
                        <span className="text-center">{position}</span>
                        <span style={{ color: `#${driver?.team_colour}`, textAlign: "center" }}>{driver.name_acronym}</span>
                    </div>
                );
            case "lapTime":
                return (
                    <div className="flex flex-col">
                        <div className="">{formatSecondsToTime(lap?.lap_duration)}</div>
                        {isShowFastestLap ? (<div className="font-thin flex flex-row justify-center gap-1">{formatSecondsToTime(fastestLap?.lap_duration)} {`(${fastestLap?.lap_number})`}</div>) : ""}
                    </div>
                );
            case "gap":
                const latestInterval: IntervalParams | undefined = intervals.filter((gap: IntervalParams) => gap.driver_number === driver.driver_number).pop();
                let gap = "+" + latestInterval?.interval;
                let gapToLeader = "+" + latestInterval?.gap_to_leader;
                if (gap == "+0" || gap == "+undefined" || gap == "+null") gap = '-';
                if (gapToLeader == "+0") gapToLeader = "-";
                return (
                    <div className="flex flex-col">
                        <span className="">{gap}</span>
                        {isShowGapToLeader ? (<span className="font-thin">{gapToLeader}</span>) : ""}
                    </div>
                );
            case "tyre":
                const stint = stints.filter(stint => stint.driver_number === driver.driver_number).pop();
                const tyreAge = stint?.lap_end ? (stint?.lap_end - stint?.lap_start!) : (lap?.lap_number! - stint?.lap_start! + stint?.tyre_age_at_start!);
                return (
                    <div className="flex flex-col mx-auto">
                        {isShowTyre ? (<div className="flex justify-center gap-1 items-center">
                            <div className="w-[25px]">{getCompoundComponent(stint?.compound!)}</div>
                            <div className="">{tyreAge}</div>
                        </div>) : ""}
                        {isShowStintNumber ? (<div className="font-thin text-center">Pit {stint?.stint_number}</div>) : ""}
                    </div>
                )
            case "lap":
                return (
                    <span>{lap?.lap_number}</span>
                )
            case "sectors":
                return (
                    <SectorSegment lap={lap!} />
                );
        }
    }

    const renderRow = (driver: DriverParams) => {
        const lap = laps?.filter(lap => lap.driver_number === driver.driver_number).pop();
        const isGreyedOut = currentLap && lap && (currentLap - lap.lap_number! >= 3);
        return (
            <TableRow key={driver.driver_number} className={isGreyedOut ? "brightness-50 bg-white" : ""}>
                {(columnKey) => <TableCell className="bg-[#111] text-center">{renderCell(driver, columnKey, laps, stints)}</TableCell>}
            </TableRow>
        )
    }

    return (
        <>
            {(positions.length > 0) ? (
                <>
                    {laps && laps.length > 0 ? (
                        <Table
                            aria-label="Live timing data"
                            classNames={classNames}
                            className="max-screen-xs"
                            removeWrapper>
                            <TableHeader columns={headers}>
                                {(header) => (
                                    <TableColumn key={header.uid} className="text-center">
                                        {header.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={sortedDrivers}>
                                {(driver) => renderRow(driver)}
                            </TableBody>
                        </Table>
                    ) : (
                        <Loading />
                    )}
                </>
            ) : <Loading />}
        </>
    );
};

export default LiveTiming;
