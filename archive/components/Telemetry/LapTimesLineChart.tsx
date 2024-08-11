// @/components/Telemetry/LapTimes.tsx

"use client"

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { RaceControlParams } from "@/interfaces/openF1";
import LapTimeTooltip from "@/components/Telemetry/LapTimeTooltip";
import { formatSecondsToTime, isValidColor } from "../../utils/helpers";
import { DriverChartData } from "@/interfaces/custom";
import { toast } from "sonner";
import LapTimeSettings from "./LapTimeSettings";
import { getZScoreThresholds, getModifiedZScoreThresholds, getChauvenetThresholds, getIQRThresholds } from "@/components/Telemetry/outlierDetection";

interface LapTimesLineChartProps {
  driversData: Map<string, DriverChartData>;
  raceControl: RaceControlParams[];
  onLapSelect: (lap_number: number) => void;
}

const LapTimes: React.FC<LapTimesLineChartProps> = ({
  driversData,
  raceControl,
  onLapSelect,
}) => {
  const [isRaceControl, setIsRaceControl] = useState<boolean>(true);
  const [isTyres, setIsTyres] = useState<boolean>(true);
  const [isOutlierDetection, setIsOutlierDetection] = useState<boolean>(true);
  const [customLowerThreshold, setCustomLowerThreshold] = useState<number>(-1);
  const [customUpperThreshold, setCustomUpperThreshold] = useState<number>(-1);
  const [iqrMultiplier, setIqrMultiplier] = useState<number>(1.5);
  const [zscoreThreshold, setZscoreThreshold] = useState<number>(3);
  const [modZscoreThreshold, setModZscoreThreshold] = useState<number>(3);
  const [outlierMethod, setOutlierMethod] = useState<string>("iqr");

  const maxLaps = Math.max(
    ...Array.from(driversData.values()).map(
      (driverData) => driverData.laps.length
    )
  );

  const xData = Array.from({ length: maxLaps }, (_, index) => index + 1);

  interface LapData {
    lap_number: number;
    raceControl: RaceControlParams[];
    interpolated?: boolean;
    [key: string]: number | RaceControlParams[] | string | undefined | boolean;
  }

  const getLapTimes = (): number[] => {
    return Array.from(driversData.values())
      .flatMap((driverData) =>
        driverData.laps
          .filter((lap) => lap.lap_duration !== null)// && !lap.is_pit_out_lap)
          .map((lap) => lap.lap_duration!)
      );
  };

  const lapTimes = getLapTimes();

  const getThresholds = () => {
    switch (outlierMethod) {
      case "z-score":
        return getZScoreThresholds(lapTimes, zscoreThreshold);
      case "mod-z-score":
        return getModifiedZScoreThresholds(lapTimes, modZscoreThreshold);
      case "chauvenet":
        return getChauvenetThresholds(lapTimes);
      default:
        return getIQRThresholds(lapTimes, iqrMultiplier);
    }
  };

  const defaultThresholds = getThresholds();
  const lowerThreshold = customLowerThreshold !== -1 ? customLowerThreshold : defaultThresholds[0];
  const upperThreshold = customUpperThreshold !== -1 ? customUpperThreshold : defaultThresholds[1];

  const interpolate = (start: number, end: number, startLap: number, endLap: number, targetLap: number): number => {
    return start + ((end - start) / (endLap - startLap)) * (targetLap - startLap);
  };

  const chartData: LapData[] = xData.map((lap_number) => {
    const lapData: LapData = { lap_number, raceControl: [] };

    Array.from(driversData.values()).forEach((driverData) => {
      const lap = driverData.laps.find(
        (lap) =>
          lap.lap_number === lap_number &&
          lap.lap_duration !== null &&
          //!lap.is_pit_out_lap &&
          (!isOutlierDetection || (lap.lap_duration! >= lowerThreshold && lap.lap_duration! <= upperThreshold))
      );

      if (lap) {
        lapData[`time_${driverData.driver.name_acronym}` as keyof typeof lapData] = lap.lap_duration!;
      } else if (isOutlierDetection) {
        const previousLap = driverData.laps
          .slice(0, lap_number)
          .reverse()
          .find(
            (prevLap) =>
              prevLap.lap_duration !== null &&
              //!prevLap.is_pit_out_lap &&
              prevLap.lap_duration! >= lowerThreshold &&
              prevLap.lap_duration! <= upperThreshold
          );

        const nextLap = driverData.laps
          .slice(lap_number)
          .find(
            (nextLap) =>
              nextLap.lap_duration !== null &&
              //!nextLap.is_pit_out_lap &&
              nextLap.lap_duration! >= lowerThreshold &&
              nextLap.lap_duration! <= upperThreshold
          );

        if (previousLap && nextLap) {
          const interpolatedTime = interpolate(
            previousLap.lap_duration!,
            nextLap.lap_duration!,
            previousLap.lap_number!,
            nextLap.lap_number!,
            lap_number
          );
          lapData[`time_${driverData.driver.name_acronym}` as keyof typeof lapData] = interpolatedTime;
          lapData.interpolated = true;
        }
      }

      const raceControlForLap = raceControl.filter(
        (message) => message.lap_number === lap_number
      );

      if (isRaceControl) {
        if (raceControlForLap.length > 0) {
          lapData[`raceControl` as keyof typeof lapData] = raceControlForLap;
        }
      }

      if (isTyres) {
        for (const stint of driverData.stintData) {
          if (lap_number >= stint.lap_start! && lap_number <= stint.lap_end!) {
            const tyreKey = `tyre_${driverData.driver.name_acronym}` as keyof LapData;
            const compoundValue = stint.compound;
            lapData[tyreKey] = compoundValue;
            break;
          }
        }
      }
    });

    return lapData;
  });

  const filteredLapTimes: number[] = chartData
    .map((data) =>
      Object.entries(data)
        .filter(([key, value]) => key !== "lap_number" && typeof value === "number")
        .map(([key, value]) => value)
    )
    .flat()
    .filter((value): value is number => typeof value === "number");

  const minLapTime: number = Math.min(...filteredLapTimes);
  const maxLapTime: number = Math.max(...filteredLapTimes);

  useEffect(() => {
    if (chartData.length === 0) {
      toast.warning("Warning", {
        description: "No data to display. Please select a driver or reload the page.",
      });
    }
  }, [chartData]);

  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutlierMethod(event.target.value);
  };

  return (
    <div className="mt-7">
      <div className="flex justify-center gap-5">
        <h2 className="text-2xl font-extralight">Lap Times</h2>
        <LapTimeSettings
          isRaceControl={isRaceControl}
          setIsRaceControl={setIsRaceControl}
          isTyres={isTyres}
          setIsTyres={setIsTyres}
          isOutlierDetection={isOutlierDetection}
          setIsOutlierDetection={setIsOutlierDetection}
          outlierMethod={outlierMethod}
          setOutlierMethod={setOutlierMethod}
          customLowerThreshold={customLowerThreshold}
          setCustomLowerThreshold={setCustomLowerThreshold}
          customUpperThreshold={customUpperThreshold}
          setCustomUpperThreshold={setCustomUpperThreshold}
          defaultThresholds={defaultThresholds}
          iqrMultiplier={iqrMultiplier}
          setIqrMultiplier={setIqrMultiplier}
          zscoreThreshold={zscoreThreshold}
          setZscoreThreshold={setZscoreThreshold}
          modZscoreThreshold={modZscoreThreshold}
          setModZscoreThreshold={setModZscoreThreshold} />
      </div>

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
              content={<LapTimeTooltip active={false} payload={[]} label={""} />}
              formatter={(value, name, props) => {
                const lapData = props.payload;
                if (lapData.interpolated) {
                  return [`${value} (interpolated)`, name];
                }
                return [value, name];
              }}
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

    </div>
  );
};

export default LapTimes;