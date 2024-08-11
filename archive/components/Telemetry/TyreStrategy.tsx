// @/components/Telemetry/TyreStrategy.tsx

"use client";

import { getCompoundColor } from "@/components/Tyres";
import { DriverParams, StintParams } from "@/interfaces/openF1";
import { driverImage } from "@/utils/helpers";
import { Image } from "@nextui-org/react";
import React, { useMemo } from 'react';

interface TyreStrategyProps {
    stints: StintParams[];
    drivers: DriverParams[];
}

const TyreStrategy: React.FC<TyreStrategyProps> = ({ stints, drivers }) => {
    const stintsByDriver = useMemo(() => {
        return stints.reduce((acc, stint) => {
            if (stint.driver_number) {
                if (!acc[stint.driver_number]) {
                    acc[stint.driver_number] = [];
                }
                acc[stint.driver_number].push(stint);
            }
            return acc;
        }, {} as { [key: number]: StintParams[] });
    }, [stints]);

    const driverNameMap = useMemo(() => {
        return drivers.reduce((acc, driver) => {
            if (driver.driver_number) {
                acc[driver.driver_number] = { acronym: driver.name_acronym, name: driver.full_name, color: `#${driver.team_colour}` };
            }
            return acc;
        }, {} as { [key: number]: { acronym: string | undefined, name: string | undefined, color: string | undefined } });
    }, [drivers]);

    const maxLap = useMemo(() => {
        return Math.max(...stints.map(stint => stint.lap_end || 0));
    }, [stints]);

    return (
        <div className="max-w-screen-xl mx-auto p-4 w-full">
            {Object.entries(stintsByDriver).map(([driverNumber, driverStints]) => (
                <div key={driverNumber} className="flex items-center my-3">
                    <Image
                        className="rounded-full w-7 mr-2"
                        src={driverImage(driverNameMap[parseInt(driverNumber)].name!)}
                        alt={`${driverNameMap[parseInt(driverNumber)].name}`} />
                    <div
                        className="w-16 text-xl font-semibold"
                        style={{ color: `${driverNameMap[parseInt(driverNumber)].color}` }}>
                        {driverNameMap[parseInt(driverNumber)].acronym}
                    </div>
                    <div className="flex-1 relative bg-[#111] h-8 overflow-hidden rounded-md">
                        {driverStints.map((stint, index) => (
                            <div
                                key={index}
                                className="absolute h-full text-black rounded-md border-x-2 border-[#111] flex justify-center"
                                style={{
                                    left: `${(stint.lap_start! - 1) / maxLap * 100}%`,
                                    width: `${(stint.lap_end! - stint.lap_start! + 1) / maxLap * 100}%`,
                                    backgroundColor: getCompoundColor(stint.compound!)!,
                                }}
                            >
                                <p className="align-middle">{stint.lap_end! - stint.lap_start!}</p>
                            </div>
                        ))}

                    </div>
                </div>
            ))}
        </div>
    );
};

export default TyreStrategy;
