// components/Telemetry/LapStatsLineChart.tsx

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  Label,
} from "recharts";
import LapStatsTooltip from "./LapStatsTooltip";
import {
  formatSecondsToTime,
  isValidColor,
  parseISOTime,
} from "@/utils/helpers";
import { Popover, PopoverContent, PopoverTrigger, Switch } from "@nextui-org/react";
import { Cog } from "lucide-react";
import { DriverChartData } from "@/interfaces/custom";
import TelemetryLapSummary from "./AverageLapStats";


interface LapStatsLineChartProps {
  driversData: Map<string, DriverChartData>;
  lapSelected: number;
}

const LapStatsLineChart: React.FC<LapStatsLineChartProps> = ({
  driversData,
  lapSelected,
}) => {
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

  const xData = new Set<number>();

  Array.from(driversData.values()).forEach((driverData) => {
    driverData.carData.forEach((carDatum) => {
      xData.add(carDatum.lap_time!);
    });
  });

  const driversDataWithArrays: [string, DriverChartData][] = Array.from(driversData.entries()).map(
    ([driverId, driverData]) => {
      const driverChartData: any[] = [];
      Array.from(xData).forEach((time) => {
        const carsData = { time };
        const carDatum = driverData.carData.find(
          (car) => car.lap_time === time
        );
        if (carDatum) {
          Object.keys(visibleCharts).forEach((parameter) => {
            const parameterKey = `${parameter}_${driverData.driver.name_acronym}` as keyof typeof carsData;
            const carDatumValue = carDatum[parameter as keyof typeof carDatum];

            if (typeof carDatumValue === 'number') {
              carsData[parameterKey] = carDatumValue;
            }
          });
          carsData[`time_${driverData.driver.name_acronym}` as keyof typeof carsData] =
            carDatum.lap_time!;
          driverChartData.push(carsData);
        }
      });
      return [driverId, { ...driverData, chartData: driverChartData }];
    }
  );

  Array.from(driversData.entries()).map((driver) => {
    const raceControlForCurrentLap = driver[1].raceControl?.find(
      (message) => message.lap_number === lapSelected
    );

    /*if (raceControlForCurrentLap) {
        console.log(raceControlForCurrentLap);
        console.log(lapSelected);
    }*/
  });

  const updatedDriversData: Map<string, DriverChartData> = new Map(driversDataWithArrays);

  const renderCharts = () => {
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

        {/*<div>
          <ScatterChart
            width={800}
            height={500}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid />
            <XAxis dataKey="x" type="number" name="X" />
            <YAxis dataKey="y" type="number" name="Y" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {Array.from(driversData.values()).map((driverData, index) => (
              <Scatter
                key={`driver-${index}`}
                name={driverData.driver.name_acronym}
                data={driverData.locationData.map((loc) => ({
                  x: loc.x,
                  y: loc.y,
                }))}
                fill={`#${driverData.driver.team_colour || "000000"}`}
              />
            ))}
          </ScatterChart>
        </div>*/}

        <div className="flex flex-col md:grid justify-center">
          {Object.keys(visibleCharts).map((parameter) => (
            <div
              key={parameter}
              className={`${visibleCharts[parameter as keyof typeof visibleCharts] ? "" : "hidden"} mx-8 my-5 flex justify-center`}
            >
              <LineChart
                width={800}
                height={300}
              >
                <XAxis
                  dataKey="time"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={true}
                  tickFormatter={formatSecondsToTime}
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
                    />
                  }
                />

                {Array.from(updatedDriversData.values()).map((driverData) => (
                  <Line
                    type="monotone"
                    data={driverData.chartData}
                    key={`time_${driverData.driver.name_acronym}`}
                    dataKey={`${parameter}_${driverData.driver.name_acronym}`}
                    name={driverData.driver.name_acronym}
                    stroke={
                      isValidColor(`#${driverData.driver.team_colour}`)
                        ? `#${driverData.driver.team_colour}`
                        : "#FFFFFF"
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </div>
          ))}
        </div>
        <div>
          <h2>Lap Summary</h2>
        </div>
      </div>
    );
  };

  return <div>{renderCharts()}</div>;
};

export default LapStatsLineChart;