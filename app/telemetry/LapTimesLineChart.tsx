// components/Telemetry/Charts/LapTimesLineChart.tsx

"use client"

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RaceControlParams } from "../../interfaces/openF1";
import LapTimeTooltip from "./LapTimeTooltip";
import { formatSecondsToTime, isValidColor } from "../../utils/helpers";
import { Cog } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent, Switch } from "@nextui-org/react";
import { DriverChartData } from "@/interfaces/custom";
import { toast } from "sonner";

interface LapTimesLineChartProps {
  driversData: Map<string, DriverChartData>;
  raceControl: RaceControlParams[];
  onLapSelect: (lap_number: number) => void;
}

const LapTimesLineChart: React.FC<LapTimesLineChartProps> = ({
  driversData,
  raceControl,
  onLapSelect,
}) => {
  const [isRaceControl, setIsRaceControl] = useState<boolean>(true);

  const maxLaps = Math.max(
    ...Array.from(driversData.values()).map(
      (driverData) => driverData.laps.length
    )
  );

  const xData = Array.from({ length: maxLaps }, (_, index) => index + 1);

  interface LapData {
    lap_number: number;
    raceControl: RaceControlParams[];
    [key: string]: number | RaceControlParams[] | undefined;
  }

  const chartData: LapData[] = xData.map((lap_number) => {
    const lapData: LapData = { lap_number, raceControl: [] };

    Array.from(driversData.values()).forEach((driverData) => {
      const lap = driverData.laps.find(
        (lap) => lap.lap_number === lap_number && lap.lap_duration !== null
        //&& !lap.is_pit_out_lap
      );

      if (lap) {
        lapData[`time_${driverData.driver.name_acronym}` as keyof typeof lapData] = lap.lap_duration!;

        const raceControlForLap = raceControl.filter(
          (message) => message.lap_number === lap_number
        );

        if (isRaceControl) {
          if (raceControlForLap.length > 0) {
            lapData[`raceControl` as keyof typeof lapData] = raceControlForLap;
          }
        }

        for (const stint of driverData.stintData) {
          if (lap_number >= stint.lap_start! && lap_number <= stint.lap_end!) {
            const tyreKey = `tyre_${driverData.driver.name_acronym}` as keyof LapData;
            const compoundValue: number | undefined = stint.compound ? Number(stint.compound) : undefined;
            lapData[tyreKey] = compoundValue;
            break;
          }
        }
      }
    });

    return lapData;
  });

  const lapTimes: number[] = chartData
    .map((data) =>
      Object.entries(data)
        .filter(([key, value]) => key !== "lap_number" && typeof value === "number")
        .map(([key, value]) => value)
    )
    .flat()
    .filter((value): value is number => typeof value === "number");

  const minLapTime: number = Math.min(...lapTimes);
  const maxLapTime: number = Math.max(...lapTimes);

  useEffect(() => {
    if (chartData.length == 0) {
      {
        toast.warning("Warning", {
          description: "No data to display. Please select a driver or reload the page."
        })
      }
    }
  }, [chartData])

  return (
    <div className="mt-7">
      <div className="flex justify-center gap-5">
        <h2 className="text-2xl font-extralight">Lap Times</h2>
        <div className="align-middle">
          <Popover placement="right" showArrow={true}>
            <PopoverTrigger>
              <Cog className="" />
            </PopoverTrigger>
            <PopoverContent className="bg-gradient-to-tl from-zinc-800 to-[#111]">
              <div className="px-1 py-2 flex flex-col font-thin">
                <Switch isSelected={isRaceControl} onValueChange={setIsRaceControl} size="sm">
                  Race Control
                </Switch>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="flex justify-center">
          <ResponsiveContainer width={800} aspect={1.75}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              onClick={(data, index) => onLapSelect(parseInt(data.activeLabel!))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lap_number" tick={false} />
              <YAxis
                domain={[minLapTime, maxLapTime]}
                tickFormatter={formatSecondsToTime}
              />
              <Tooltip
                content={
                  <LapTimeTooltip active={false} payload={[]} label={""} />
                }
              />
              <Legend />
              {Array.from(driversData.values()).map((driverData) => (
                <Line
                  key={driverData.driver.name_acronym}
                  type="monotone"
                  dataKey={`time_${driverData.driver.name_acronym}`}
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
          </ResponsiveContainer>
        </div>
      ) : (
        <>
          <p className="text-center font-extralight m-5 mb-10">No data to display. Please select a driver or reload the page.</p>
        </>
      )}
    </div>
  );
};

export default LapTimesLineChart;
