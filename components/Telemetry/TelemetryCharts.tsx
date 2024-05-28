// @/components/Telemetry/TelemetryCharts.tsx

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DriverChartData } from '@/interfaces/custom';
import { isValidColor, parseISOTimeFull } from '@/utils/helpers';
import LapStatsTooltip from './TelemetryChartsTooltip';
import { Popover, PopoverContent, PopoverTrigger, Switch } from '@nextui-org/react';
import { Cog } from 'lucide-react';

interface TelemetryChartsProps {
    driversData: Map<string, DriverChartData>;
    lapSelected: number;
}

const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ driversData, lapSelected }) => {
    const [visibleCharts, setVisibleCharts] = useState({
        speed: true,
        throttle: true,
        brake: true,
        rpm: true,
        n_gear: true,
        drs: true,
    });

    const [useTimeNormalizedData, setUseTimeNormalizedData] = useState(true);

    const toggleChartVisibility = (parameter: string) => {
        setVisibleCharts((prevVisibleCharts) => ({
            ...prevVisibleCharts,
            [parameter]: !prevVisibleCharts[parameter as keyof typeof prevVisibleCharts],
        }));
    };

    const parameterDisplayText = {
        speed: "Speed (km/h)",
        throttle: "Throttle (%)",
        brake: "Brake (%)",
        rpm: "RPM",
        n_gear: "Gear",
        drs: "DRS",
    };

    const allDates = Array.from(new Set(Array.from(driversData.values()).flatMap(driverData => driverData.carData.map(carData => carData.date)))).sort();

    const renderLineChart = (parameter: string) => {
        const data = useTimeNormalizedData ? getTimeNormalizedData(parameter) : getDateNormalizedData(parameter);

        return (
            <ResponsiveContainer key={parameter} width="100%" height={400}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis
                        dataKey={useTimeNormalizedData ? "time" : "date"}
                        tickFormatter={(value) => {
                            // Format the date here if useTimeNormalizedData is false
                            return useTimeNormalizedData ? value : parseISOTimeFull(value); // formatTime is a function to format date as per your requirement
                        }}
                    />
                    <YAxis
                        label={{
                            value: `${parameterDisplayText[parameter as keyof typeof visibleCharts]}`,
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip
                        content={
                            <LapStatsTooltip
                                active={false}
                                payload={[]}
                                label={""}
                                chartType={parameter}
                                dataNormalization={useTimeNormalizedData ? "time" : "date"}
                            />
                        }
                    />
                    <Legend />
                    {Array.from(driversData.values()).map((driverData, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={driverData.driver.name_acronym}
                            name={driverData.driver.name_acronym}
                            stroke={isValidColor(`#${driverData.driver.team_colour}`)
                                ? `#${driverData.driver.team_colour}`
                                : "#FFFFFF"}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
    };

    const getTimeNormalizedData = (parameter: string) => {
        const normalizedData = allDates.map(date => {
            const dataPoint: { [key: string]: any } = { time: date };
            driversData.forEach((driverData, driverKey) => {
                const lapStartDate = driverData.carData[0]?.date ? new Date(driverData.carData[0].date).getTime() : null;
                if (!lapStartDate) return; // Skip this driver if the start date is not valid
                const carData = driverData.carData.find(data => data.date === date);
                dataPoint["time"] = (new Date(carData?.date!).getTime() - lapStartDate) / 1000;
                dataPoint[driverData.driver.name_acronym!] = carData ? carData[parameter as keyof typeof carData] : null;
            });
            return dataPoint;
        });
        return normalizedData;
    };

    const getDateNormalizedData = (parameter: string) => {
        const normalizedData = allDates.map(date => {
            const dataPoint: { [key: string]: any } = { date };
            driversData.forEach((driverData, driverKey) => {
                const carData = driverData.carData.find(data => data.date === date);
                dataPoint[driverData.driver.name_acronym!] = carData ? carData[parameter as keyof typeof carData] : null;
            });
            return dataPoint;
        });
        return normalizedData;
    };

    const toggleNormalizationType = () => {
        setUseTimeNormalizedData(prevState => !prevState);
    };

    return (
        <div className="">
            <div className="flex justify-center gap-5 m-5">
                <h2 className="text-2xl font-extralight">{`Telemetry for Lap ${lapSelected}`}</h2>
                <div className="align-middle">
                    <Popover placement="right" showArrow={true}>
                        <PopoverTrigger>
                            <Cog className="rotate-0 hover:rotate-180 transition-transform duration-700 ease-in-out" />
                        </PopoverTrigger>
                        <PopoverContent className="bg-gradient-to-tl from-zinc-800 to-[#111]">
                            <div className="px-1 py-2 flex flex-col font-thin gap-3">
                                {Object.entries(visibleCharts).map(([key, value]) => (
                                    <Switch isSelected={value} onValueChange={() => toggleChartVisibility(key)} size="sm" key={`${key}-switch`}>
                                        {parameterDisplayText[key as keyof typeof parameterDisplayText]}
                                    </Switch>
                                ))}
                                <Switch isSelected={useTimeNormalizedData} onValueChange={toggleNormalizationType} size="sm">
                                    {useTimeNormalizedData ? "Time Normalized" : "Date Normalized"}
                                </Switch>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="lg:grid grid-rows-3 grid-flow-col gap-4">
                {Object.entries(visibleCharts).map(([key, value]) => {
                    if (!value) return null;
                    return (
                        <div className="max-w-screen-md mx-auto" key={key}>
                            {renderLineChart(key)}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default TelemetryCharts;



/*import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DriverChartData } from '@/interfaces/custom';
import { isValidColor } from '@/utils/helpers';
import LapStatsTooltip from './LapStatsTooltip';
import { Popover, PopoverContent, PopoverTrigger, Switch } from '@nextui-org/react';
import { Cog } from 'lucide-react';

interface LapStatsLineChartProps {
    driversData: Map<string, DriverChartData>;
    lapSelected: number;
}

const LapStatsLineChart: React.FC<LapStatsLineChartProps> = ({ driversData, lapSelected }) => {
    const [visibleCharts, setVisibleCharts] = useState({
        speed: true,
        throttle: true,
        brake: true,
        rpm: true,
        n_gear: true,
        drs: true,
    });

    const toggleChartVisibility = (parameter: string) => {
        setVisibleCharts((prevVisibleCharts) => ({
            ...prevVisibleCharts,
            [parameter]: !prevVisibleCharts[parameter as keyof typeof prevVisibleCharts],
        }));
    };

    const parameterDisplayText = {
        speed: "Speed (km/h)",
        throttle: "Throttle (%)",
        brake: "Brake (%)",
        rpm: "RPM",
        n_gear: "Gear",
        drs: "DRS",
    };

    // Collect all unique dates
    const allDates = Array.from(new Set(Array.from(driversData.values()).flatMap(driverData => driverData.carData.map(carData => carData.date)))).sort();

    const renderLineChart = (parameter: string) => {
        const normalizedData = allDates.map(date => {
            const dataPoint: { [key: string]: any } = { date };
            driversData.forEach((driverData, driverKey) => {
                const carData = driverData.carData.find(data => data.date === date);
                dataPoint[driverData.driver.name_acronym!] = carData ? carData[parameter] : null; // Use null for missing data
            });
            return dataPoint;
        });

        return (

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    key={parameter}
                    width={500}
                    height={300}
                    data={normalizedData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                        content={
                            <LapStatsTooltip
                                active={false}
                                payload={[]}
                                label={""}
                                chartType={parameter}
                            />
                        }
                    />
                    <Legend />
                    {Array.from(driversData.values()).map((driverData, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={driverData.driver.name_acronym}
                            name={driverData.driver.name_acronym}
                            stroke={isValidColor(`#${driverData.driver.team_colour}`)
                                ? `#${driverData.driver.team_colour}`
                                : "#FFFFFF"}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="">
            <div className="flex justify-center gap-5">
                <h2 className="text-2xl font-extralight">{`Telemetry for Lap ${lapSelected}`}</h2>
                <div className="align-middle">
                    <Popover placement="right" showArrow={true}>
                        <PopoverTrigger>
                            <Cog className="" />
                        </PopoverTrigger>
                        <PopoverContent className="bg-gradient-to-tl from-zinc-800 to-[#111]">
                            <div className="px-1 py-2 flex flex-col font-thin gap-3">
                                {Object.entries(visibleCharts).map(([key, value]) => (
                                    <Switch isSelected={value} onValueChange={() => toggleChartVisibility(key)} size="sm" key={`${key}-switch`}>
                                        {parameterDisplayText[key as keyof typeof parameterDisplayText]}
                                    </Switch>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {Object.entries(visibleCharts).map(([key, value]) => {
                if (!value) return null;
                return renderLineChart(key);
            })}
        </div >
    );
};

export default LapStatsLineChart;



/*
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DriverChartData } from '@/interfaces/custom';
import { isValidColor } from '@/utils/helpers';
import LapStatsTooltip from './LapStatsTooltip';
import { Popover, PopoverContent, PopoverTrigger, Switch } from '@nextui-org/react';
import { Cog } from 'lucide-react';

interface LapStatsLineChartProps {
    driversData: Map<string, DriverChartData>;
    lapSelected: number;
}

const LapStatsLineChart: React.FC<LapStatsLineChartProps> = ({ driversData, lapSelected }) => {
    const [visibleCharts, setVisibleCharts] = useState({
        speed: true,
        throttle: true,
        brake: true,
        rpm: true,
        n_gear: true,
        drs: true,
    });

    const toggleChartVisibility = (parameter: string) => {
        setVisibleCharts((prevVisibleCharts) => ({
            ...prevVisibleCharts,
            [parameter]: !prevVisibleCharts[parameter as keyof typeof prevVisibleCharts],
        }));
    };

    const parameterDisplayText = {
        speed: "Speed (km/h)",
        throttle: "Throttle (%)",
        brake: "Brake (%)",
        rpm: "RPM",
        n_gear: "Gear",
        drs: "DRS",
    };

    const renderLineChart = (parameter: string) => {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    key={parameter}
                    width={500}
                    height={300}
                    data={normalizedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        label={{ value: "Time (s)", position: "insideBottomRight", offset: -5 }}
                        domain={[0, maxLapDuration]}
                    />
                    <YAxis />
                    <Tooltip
                        content={
                            <LapStatsTooltip
                                active={false}
                                payload={[]}
                                label={""}
                                chartType={parameter}
                            />
                        }
                    />
                    <Legend />
                    {Array.from(driversData.keys()).map((driverKey, index) => {
                        const driver = driversData.get(driverKey);
                        const strokeColor = isValidColor(`#${driver?.driver.team_colour}`)
                            ? `#${driver?.driver.team_colour}`
                            : "#FFFFFF";
                        return (
                            <Line
                                key={index}
                                type="monotone"
                                dataKey={parameter}
                                data={normalizedData.filter(data => data.driver === driver?.driver.name_acronym)}
                                name={driver?.driver.name_acronym}
                                stroke={strokeColor}
                                dot={false}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        );
    };

    const normalizedData = Array.from(driversData.values()).flatMap(driverData => {
        const lapStartDate = driverData.carData[0]?.date ? new Date(driverData.carData[0].date).getTime() : null;
        if (!lapStartDate) return []; // Skip this driver if the start date is not valid

        return driverData.carData
            .filter(carData => carData.date) // Ensure the date is defined
            .map(carData => ({
                time: (new Date(carData.date).getTime() - lapStartDate) / 1000, // Convert to seconds
                speed: carData.speed,
                throttle: carData.throttle,
                brake: carData.brake,
                rpm: carData.rpm,
                n_gear: carData.n_gear,
                drs: carData.drs,
                driver: driverData.driver.name_acronym,
                teamColour: driverData.driver.team_colour,
            }));
    });

    // Calculate the maximum lap duration among all drivers
    const maxLapDuration = Math.max(
        ...normalizedData.map(driverData => driverData.time)
    );

    return (
        <div>
            <div className="flex justify-center gap-5">
                <h2 className="text-2xl font-extralight">{`Telemetry for Lap ${lapSelected}`}</h2>
                <div className="align-middle">
                    <Popover placement="right" showArrow={true}>
                        <PopoverTrigger>
                            <Cog className="" />
                        </PopoverTrigger>
                        <PopoverContent className="bg-gradient-to-tl from-zinc-800 to-[#111]">
                            <div className="px-1 py-2 flex flex-col font-thin gap-3">
                                {Object.entries(visibleCharts).map(([key, value]) => (
                                    <Switch isSelected={value} onValueChange={() => toggleChartVisibility(key)} size="sm" key={`${key}-switch`}>
                                        {parameterDisplayText[key as keyof typeof parameterDisplayText]}
                                    </Switch>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {Object.entries(visibleCharts).map(([key, value]) => {
                if (!value) return null;
                return renderLineChart(key);
            })}
        </div>
    );
};

export default LapStatsLineChart;
*/