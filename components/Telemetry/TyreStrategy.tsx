// @/components/Telemetry/TyreStrategy.tsx

"use client";

import React from 'react';
import { useMemo } from 'react';
import { getCompoundColor } from "@/components/Tyres";
import type { OFDriver, OFStint } from "@/types/openF1.types";
import { driverImage, numberImage } from "@/utils/helpers";
import { Image } from "@heroui/react";

interface TyreStrategyProps {
    stints: OFStint[];
    drivers: OFDriver[];
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
        }, {} as { [key: number]: OFStint[] });
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
        <div className="max-w-screen-xl mx-auto p-4 w-full space-y-3">
            {Object.entries(stintsByDriver).map(([driverNumber, driverStints]) => {
                const driverInfo = driverNameMap[Number(driverNumber)];
                const driverColor = driverInfo?.color || "#ccc";

                return (
                    <div key={driverNumber} className="flex items-center gap-4">
                        {/* Driver Info */}
                        <div className="flex items-center gap-2">
                            <Image
                                className="rounded-sm p-1 w-8 h-8 bg-white"
                                src={numberImage(driverInfo.name?.split(" ")[0], driverInfo.name?.split(" ")[1])}
                                alt={driverInfo.name}
                            />
                            <div className="flex flex-col leading-tight">
                                <span
                                    className="text-lg font-light"
                                    style={{ color: driverColor }}
                                >
                                    {driverInfo.acronym}
                                </span>
                            </div>
                        </div>

                        {/* Strategy Line (this is the fix: make it flex) */}
                        <div className="flex flex-1 items-center h-4">
                            {driverStints.map((stint, index) => {
                                const width = ((stint.lap_end - stint.lap_start + 1) / maxLap) * 100;
                                const isLast = index === driverStints.length - 1;

                                return (
                                    <React.Fragment key={`${driverNumber}-${stint.stint_number}`}>
                                        {/* Colored Stint Line */}
                                        <div
                                            className="h-[2px] rounded-sm"
                                            style={{
                                                width: `${width}%`,
                                                background: getCompoundColor(stint.compound),
                                            }}
                                            title={`Laps ${stint.lap_start}–${stint.lap_end} (${stint.compound})`}
                                        />

                                        {/* Pit Lap Marker between stints */}
                                        {!isLast && (
                                            <div
                                                className="text-lg font-extralight mx-1 text-muted-foreground text-center"
                                                style={{
                                                    width: "1%",
                                                    minWidth: "20px", // Ensures it's readable even on short stints
                                                }}
                                            >
                                                {driverStints[index + 1].lap_start}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TyreStrategy;
