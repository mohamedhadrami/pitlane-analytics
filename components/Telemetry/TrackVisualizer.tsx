// @/components/Telemetry/TrackVisualizer.tsx

"use client"

import { DriverChartData } from '@/interfaces/custom';
import { mvCircuit, trackElement } from '@/interfaces/multiviewer';
import { LocationParams } from '@/interfaces/openF1';
import { isValidColor } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TrackVisualizerTooltip from './TrackVisualizerTooltip';
import PindropShape from './Pindrop';

interface TrackVisualizerProps {
    circuitData: mvCircuit;
    driverData: Map<string, DriverChartData>;
}

interface DataPoint {
    x: number;
    y: number;
    type?: string;
    number?: number;
}

const TrackVisualizer: React.FC<TrackVisualizerProps> = ({ circuitData, driverData }) => {
    const [trackData, setTrackData] = useState<DataPoint[]>([]);
    const [corners, setCorners] = useState<DataPoint[]>([]);
    const [marshalSectors, setMarshalSectors] = useState<DataPoint[]>([]);
    const [marshalLights, setMarshalLights] = useState<DataPoint[]>([]);
    const [rotation, setRotation] = useState<number>(0);

    useEffect(() => {
        setRotation(circuitData.rotation);
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
            type: 'Corner',
            number: datum.number,
            x: datum.trackPosition.x,
            y: datum.trackPosition.y
        }));
        setCorners(cornersData);

        const marshalSectorsData = circuitData.marshalSectors.map((datum: trackElement) => ({
            type: 'Marshal Sector',
            number: datum.number,
            x: datum.trackPosition.x,
            y: datum.trackPosition.y
        }));
        setMarshalSectors(marshalSectorsData);

        const marshalLightsData = circuitData.marshalLights.map((datum: trackElement) => ({
            type: 'Marshal Light',
            number: datum.number,
            x: datum.trackPosition.x,
            y: datum.trackPosition.y
        }));
        setMarshalLights(marshalLightsData);

    }, [circuitData]);

    const getMinMax = (key: keyof DataPoint) => {
        const values = [...trackData, ...corners, ...marshalSectors, ...marshalLights]
            .map(point => point[key])
            .filter((value): value is number => value !== undefined);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { min, max };
    };

    const xRange = getMinMax('x');
    const yRange = getMinMax('y');

    const maxRange = Math.max(xRange.max - xRange.min, yRange.max - yRange.min);

    const rotatePoint = (x: number, y: number, angleRadians: number): { x: number; y: number } => {
        const cosTheta = Math.cos(angleRadians);
        const sinTheta = Math.sin(angleRadians);
        const newX = x * cosTheta - y * sinTheta;
        const newY = x * sinTheta + y * cosTheta;
        return { x: newX, y: newY };
    };

    const rotatedTrackData = trackData.map(point => {
        const rotatedPoint = rotatePoint(point.x, point.y, (rotation * Math.PI) / 180);
        return { x: rotatedPoint.x, y: rotatedPoint.y };
    });

    const rotatedCornersData = corners.map(point => {
        const rotatedPoint = rotatePoint(point.x, point.y, (rotation * Math.PI) / 180);
        return { x: rotatedPoint.x, y: rotatedPoint.y };
    });

    const rotatedMarshalSectorsData = marshalSectors.map(point => {
        const rotatedPoint = rotatePoint(point.x, point.y, (rotation * Math.PI) / 180);
        return { x: rotatedPoint.x, y: rotatedPoint.y };
    });

    const rotatedMarshalLightsData = marshalLights.map(point => {
        const rotatedPoint = rotatePoint(point.x, point.y, (rotation * Math.PI) / 180);
        return { x: rotatedPoint.x, y: rotatedPoint.y };
    });

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
                    <Tooltip cursor={false} content={<TrackVisualizerTooltip />} />

                    <Scatter
                        name="Track Outline"
                        data={rotatedTrackData}
                        fill="#FFFFFF"
                        line={{ strokeWidth: 14 }}
                        shape={() => <div />}
                    />
                    <Scatter
                        name="Track Layout"
                        data={rotatedTrackData}
                        fill="#000000"
                        line={{ strokeWidth: 10 }}
                        shape={() => <div />}
                    />

                    {Array.from(driverData).map(([driverId, driver]) => {
                        const locationData = driver.locationData;
                        if (locationData && locationData.length > 0) {
                            const rotatedLocationData = locationData.map((location: LocationParams) => {
                                const rotatedPoint = rotatePoint(location.x!, location.y!, (rotation * Math.PI) / 180);
                                return { x: rotatedPoint.x, y: rotatedPoint.y };
                            });

                            return (
                                <Scatter
                                    key={driverId}
                                    name={`Car Location - ${driver.driver.full_name}`}
                                    data={rotatedLocationData}
                                    fill={isValidColor(`#${driver.driver.team_colour}`) ? `#${driver.driver.team_colour}` : "#FFFFFF"}
                                    line={{ strokeWidth: 1 }}
                                    shape={() => <div />}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}

                    <Scatter
                        name="Corners"
                        data={rotatedCornersData}
                        fill="#ff0000"
                        shape={<PindropShape fill="#ff0000" />}
                    />

                    <Scatter
                        name="Marshal Sectors"
                        data={rotatedMarshalSectorsData}
                        fill="#00ff00"
                        shape={<PindropShape fill="#00ff00" />}
                    />

                    <Scatter
                        name="Marshal Lights"
                        data={rotatedMarshalLightsData}
                        fill="#0000ff"
                        shape={<PindropShape fill="#0000ff" />}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );

};

export default TrackVisualizer;
