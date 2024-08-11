// @/components/Telemetry/LapSummary.tsx

import React, { useMemo } from 'react';
import { DriverChartData } from '@/interfaces/custom';
import SectorSegment from '@/components/Dashboard/SectorSegments';
import { formatSecondsToTime, isValidColor } from '@/utils/helpers';
import { Table, TableHeader, TableColumn, TableBody, TableCell, TableRow } from '@nextui-org/react';
import { getCompoundComponent } from '@/components/Tyres';
import { CarDataParams } from '@/interfaces/openF1';


function calculateAverageSpeed(carData: CarDataParams[]): number {
    if (!carData.length) return 0;
    
    const totalSpeed = carData.reduce((sum, data) => sum + (data.speed || 0), 0);
    return Math.round(totalSpeed / carData.length);
}


interface LapSummaryProps {
    driversData: Map<string, DriverChartData>;
    lapSelected: number;
}

const LapSummary: React.FC<LapSummaryProps> = ({ driversData, lapSelected }) => {
    const headers = [
        { name: "Driver", uid: "driver" },
        { name: "Lap Time", uid: "lapTime" },
        { name: "Tyres", uid: "tyre" },
        { name: "Average Speed", uid: "avgSpeed" },
        { name: "Sectors", uid: "sectors" },
    ]

    const classNames = useMemo(
        () => ({
            th: ["bg-transparent text-foreground text-sm font-extralight border-b border-divider"],
            tr: ["rounded-full border-b-1 border-default-300 last:border-none"],
            td: ["text-foreground !bg-black"],
            table: ["rounded-xl bg-black"]
        }),
        [],
    );

    return (
        <div className="">
            <div className="flex justify-center gap-5 m-5">
                <h2 className="text-2xl font-extralight">{`Lap Summary`}</h2>
                <div className="align-middle">
                </div>
            </div>
            <Table
                aria-label="Live timing data"
                classNames={classNames}
                className="max-w-screen-sm mx-auto"
                removeWrapper>
                <TableHeader columns={headers}>
                    {(header) => (
                        <TableColumn key={header.uid} className="text-center">
                            {header.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody>
                    {Array.from(driversData.values()).map((driverData) => {
                        const driverLap = driverData.laps.find((lap) => lap.lap_number === lapSelected);
                        const stint = driverData.stintData.find(stint => lapSelected >= stint.lap_start! && (stint.lap_end ? lapSelected <= stint.lap_end : true));
                        const avgSpeed = calculateAverageSpeed(driverData.carData);
                        const tyreAge = driverLap?.lap_number! - stint?.lap_start! + stint?.tyre_age_at_start!;
                        return (
                            <TableRow key={driverData.driver.driver_number} className="text-center items-center">
                                <TableCell
                                    style={{
                                        color: isValidColor(`#${driverData.driver.team_colour}`)
                                            ? `#${driverData.driver.team_colour}`
                                            : "#FFFFFF"
                                    }}
                                    className="text-center"
                                >
                                    {driverData.driver.name_acronym}
                                </TableCell>
                                <TableCell>{formatSecondsToTime(driverLap?.lap_duration)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col mx-auto">
                                        <div className="flex justify-center gap-1 items-center">
                                            <div className="w-[25px]">{getCompoundComponent(stint?.compound!)}</div>
                                            <div className="">{tyreAge}</div>
                                        </div>
                                        <div className="font-thin text-center">Pit {stint?.stint_number}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {avgSpeed}
                                </TableCell>
                                <TableCell className="flex justify-center"><SectorSegment lap={driverLap!} /></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default LapSummary;
