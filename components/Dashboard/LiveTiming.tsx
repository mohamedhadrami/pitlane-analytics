
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { DriverParams, LapParams, StintParams } from "../../interfaces/openF1";
import React, { useEffect, useState } from "react";
import SectorSegment from "./SectorSegments";
import { getCompoundComponent } from "../Tyres";
import { formatSecondsToTime } from "../../utils/helpers";
import Loading from "../Loading";

const headers = [
    { name: "POS", uid: "position" },
    { name: "Driver", uid: "driver" },
    { name: "Lap Time", uid: "lapTime" },
    { name: "Gap", uid: "gap" },
    { name: "Tyre", uid: "tyre" },
    { name: "Lap", uid: "lap" },
    { name: "Sectors", uid: "sectors" }
]

const LiveTiming: React.FC<{ drivers: DriverParams[], stints: StintParams[], laps: LapParams[] }> = ({ drivers, stints, laps }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const renderCell = (driver: DriverParams, columnKey: React.Key, laps: LapParams[], stints: StintParams[]) => {
        const stint = stints.filter(stint => stint.driver_number === driver.driver_number).pop();
        const lap = laps?.pop();
        const tyreAge = stint?.lap_end ? (stint?.lap_end - stint?.lap_start) : (lap?.lap_number - stint?.lap_start + stint?.tyre_age_at_start)
        switch (columnKey) {
            case "position":
            case "driver":
                return (
                    <span style={{color: `#${driver?.team_colour}`, textAlign: "center"}}>{driver.driver_number} {driver.name_acronym}</span>
                )
            case "lapTime":
                return (
                    <span>{formatSecondsToTime(lap?.lap_duration)}</span>
                )
            case "gap":
                return (
                    <span></span>
                )
            case "tyre":
                return (
                    <div style={{ width: "25px", marginLeft: "auto", marginRight: "auto" }}>
                        {getCompoundComponent(stint?.compound)}{tyreAge}
                    </div>
                )
            case "lap":
                return (
                    <span>{lap?.lap_number}</span>
                )
            case "sectors":
                return (
                    <SectorSegment lap={lap} />
                );
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {laps && laps.length > 0 ? (
                        <Table aria-label="Example static collection table">
                            <TableHeader columns={headers}>
                                {(header) => (
                                    <TableColumn key={header.uid}>
                                        {header.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={drivers}>
                                {(driver) => (
                                    <TableRow key={driver.driver_number}>
                                        {(columnKey) => <TableCell style={{ backgroundColor: "#111", textAlign: "center" }}>{renderCell(driver, columnKey, laps, stints)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <Loading />
                    )}
                </>
            )}
        </>
    );
};

export default LiveTiming;
