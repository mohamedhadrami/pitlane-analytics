// @/components/Telemetry/PitStrategy.tsx

"use client";

import { getCompoundColor } from "@/components/Tyres";
import { DriverParams, StintParams } from "@/interfaces/openF1";
import React, { useMemo } from 'react';

interface PitStrategyProps {
    stints: StintParams[];
    drivers: DriverParams[];
}

const PitStrategy: React.FC<PitStrategyProps> = ({ stints, drivers }) => {
    const stintsByDriver: { [key: number]: StintParams[] } = {};

    stints.forEach((stint) => {
        if (stint.driver_number) {
            if (!stintsByDriver[stint.driver_number]) {
                stintsByDriver[stint.driver_number] = [];
            }
            stintsByDriver[stint.driver_number].push(stint);
        }
    });

    const driverNameMap: { [key: number]: string | undefined } = {};
    drivers.forEach((driver) => {
        if (driver.driver_number) {
            driverNameMap[driver.driver_number] = driver.name_acronym;
        }
    });

    const maxLap = useMemo(() => {
        return Math.max(...stints.map(stint => stint.lap_end || 0));
    }, [stints]);

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            {Object.entries(stintsByDriver).map(([driverNumber, driverStints]) => (
                <div key={driverNumber} className="flex items-center mb-1">
                    <div className="w-16 text-xl font-semibold">{driverNameMap[parseInt(driverNumber)]}</div>
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

export default PitStrategy;
