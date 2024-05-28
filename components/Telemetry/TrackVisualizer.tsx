// @/components/Telemetry/TrackVisualizer.tsx

"use client"

import { DriverChartData } from '@/interfaces/custom';
import { mvCircuit, trackElement } from '@/interfaces/multiviewer';
import { LocationParams } from '@/interfaces/openF1';
import { isValidColor } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrackVisualizerProps {
    circuitData: mvCircuit;
    driverData: Map<string, DriverChartData>;
}

interface DataPoint {
    x: number;
    y: number;
}

const TrackVisualizer: React.FC<TrackVisualizerProps> = ({ circuitData, driverData }) => {
    const [trackData, setTrackData] = useState<DataPoint[]>([]);
    const [corners, setCorners] = useState<DataPoint[]>([]);
    const [marshalSectors, setMarshalSectors] = useState<DataPoint[]>([]);
    const [marshalLights, setMarshalLights] = useState<DataPoint[]>([]);

    useEffect(() => {
        const x = circuitData.x;
        const y = circuitData.y;
        let trackData: DataPoint[] = [];
        if (x && y && x.length === y.length) {
            trackData = x.map((value: number, index: number) => ({
                x: value,
                y: y[index],
            }));
        }
        setTrackData(trackData);

        const cornersData = circuitData.corners.map((datum: trackElement) => ({
            x: datum.trackPosition.x,
            y: datum.trackPosition.y,
        }));
        setCorners(cornersData);

        const marshalSectorsData = circuitData.marshalSectors.map((datum: trackElement) => ({
            x: datum.trackPosition.x,
            y: datum.trackPosition.y,
        }));
        setMarshalSectors(marshalSectorsData);

        const marshalLightsData = circuitData.marshalLights.map((datum: trackElement) => ({
            x: datum.trackPosition.x,
            y: datum.trackPosition.y,
        }));
        setMarshalLights(marshalLightsData);

    }, [circuitData]);

    const getMinMax = (key: keyof DataPoint) => {
        const values = [...trackData, ...corners, ...marshalSectors, ...marshalLights].map(point => point[key]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { min, max };
    };

    const xRange = getMinMax('x');
    const yRange = getMinMax('y');

    const maxRange = Math.max(xRange.max - xRange.min, yRange.max - yRange.min);

    return (
        <div className="flex justify-center">
            <ResponsiveContainer height={800} className="max-w-screen-lg">
                <ScatterChart>
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="X"
                        domain={[xRange.min, xRange.min + maxRange]}
                        axisLine={false}
                        tick={false}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Y"
                        domain={[yRange.min, yRange.min + maxRange]}
                        axisLine={false}
                        tick={false}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter
                        name="Track Layout"
                        data={trackData}
                        fill="#FFFFFF"
                        line={{ strokeWidth: 10 }}
                        shape={() => <div />}
                    />
                    
                    <Scatter
                        name="Corners"
                        data={corners}
                        fill="#ff0000"
                    />

                    <Scatter
                        name="Marshal Sectors"
                        data={marshalSectors}
                        fill="#00ff00"
                    />

                    <Scatter
                        name="Marshal Lights"
                        data={marshalLights}
                        fill="#0000ff"
                    />

                    {Array.from(driverData).map(([driverId, driver]) => {
                        const locationData = driver.locationData;
                        if (locationData && locationData.length > 0) {
                            return (
                                <Scatter
                                    key={driverId}
                                    name={`Car Location - ${driver.driver.full_name}`}
                                    data={locationData.map((location: LocationParams) => ({
                                        x: location.x,
                                        y: location.y,
                                    }))}
                                    fill={isValidColor(`#${driver.driver.team_colour}`)
                                        ? `#${driver.driver.team_colour}`
                                        : "#FFFFFF"}
                                    line={{ strokeWidth: 3 }}
                                    shape={() => <div />}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrackVisualizer;
