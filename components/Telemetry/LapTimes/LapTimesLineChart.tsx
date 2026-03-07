// @/components/Telemetry/LapTimes.tsx

"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
<<<<<<< HEAD
import { RaceControlParams } from "@/interfaces/openF1";
import LapTimeTooltip from "@/components/Telemetry/LapTimes/LapTimeTooltip";
import { formatSecondsToTime, isValidColor } from "../../../utils/helpers";
import { DriverChartData } from "@/interfaces/custom";
=======
import type { OFRaceControl } from "@/types/openF1.types";
import LapTimeTooltip from "@/components/Telemetry/LapTimes/LapTimeTooltip";
import { formatSecondsToTime, isValidColor } from "../../../utils/helpers";
import { DriverChartData } from "@/types/custom";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
import { toast } from "sonner";
import LapTimeSettings from "./LapTimeSettings";
import { getZScoreThresholds, getModifiedZScoreThresholds, getChauvenetThresholds, getIQRThresholds } from "@/components/Telemetry/LapTimes/outlierDetection";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { useLapTimeChart } from "@/context/Telemetry/LapTimeChartContext";
import { motion } from "framer-motion";
import { useTelemetryUI } from "@/context/Telemetry/TelemetryUIContext";


const LapTimes: React.FC = () => {

  const {
    raceControl,
    selectedDrivers: driversData,
    setSelectedLap: onLapSelect,
  } = useTelemetry();

  const {
    isRaceControl, setIsRaceControl,
    isTyres, setIsTyres,
    isOutlierDetection, setIsOutlierDetection,
    customLowerThreshold, setCustomLowerThreshold,
    customUpperThreshold, setCustomUpperThreshold,
    iqrMultiplier, setIqrMultiplier,
    zscoreThreshold, setZscoreThreshold,
    modZscoreThreshold, setModZscoreThreshold,
    outlierMethod, setOutlierMethod
  } = useLapTimeChart()

  const maxLaps = Math.max(
    ...Array.from(driversData.values()).map(
      (driverData) => driverData.laps.length
    )
  );

  const xData = Array.from({ length: maxLaps }, (_, index) => index + 1);

  interface LapData {
    lap_number: number;
    raceControl: OFRaceControl[];
    interpolated?: boolean;
    [key: string]: number | OFRaceControl[] | string | undefined | boolean;
  }

  const getLapTimes = (): number[] => {
    return Array.from(driversData.values())
      .flatMap((driverData) =>
        driverData.laps
          .filter((lap) => lap.lap_duration !== null)// && !lap.is_pit_out_lap)
          .map((lap) => lap.lap_duration)
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

    for (const driverData of driversData.values()) {
      const lap = driverData.laps.find(
        (lap) =>
          lap.lap_number === lap_number &&
          lap.lap_duration !== null &&
          //!lap.is_pit_out_lap &&
          (!isOutlierDetection || (lap.lap_duration >= lowerThreshold && lap.lap_duration <= upperThreshold))
      );

      if (lap) {
        lapData[`time_${driverData.driver.name_acronym}` as keyof typeof lapData] = lap.lap_duration;
      } else if (isOutlierDetection) {
        const previousLap = driverData.laps
          .slice(0, lap_number)
          .reverse()
          .find(
            (prevLap) =>
              prevLap.lap_duration !== null &&
              //!prevLap.is_pit_out_lap &&
              prevLap.lap_duration >= lowerThreshold &&
              prevLap.lap_duration <= upperThreshold
          );

        const nextLap = driverData.laps
          .slice(lap_number)
          .find(
            (nextLap) =>
              nextLap.lap_duration !== null &&
              //!nextLap.is_pit_out_lap &&
              nextLap.lap_duration >= lowerThreshold &&
              nextLap.lap_duration <= upperThreshold
          );

        if (previousLap && nextLap) {
          const interpolatedTime = interpolate(
            previousLap.lap_duration,
            nextLap.lap_duration,
            previousLap.lap_number,
            nextLap.lap_number,
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
          lapData["raceControl" as keyof typeof lapData] = raceControlForLap;
        }
      }

      if (isTyres) {
        for (const stint of driverData.stintData) {
          if (lap_number >= stint.lap_start && lap_number <= stint.lap_end) {
            const tyreKey = `tyre_${driverData.driver.name_acronym}` as keyof LapData;
            const compoundValue = stint.compound;
            lapData[tyreKey] = compoundValue;
            break;
          }
        }
      }
    };

    return lapData;
  });

  const filteredLapTimes: number[] = chartData
    .flatMap((data) =>
      Object.entries(data)
        .filter(([key, value]) => key !== "lap_number" && typeof value === "number")
        .map(([key, value]) => value)
    )
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

  const { direction } = useTelemetryUI();
  const commonTransition = { duration: 0.5, ease: "easeInOut" };
  const [initialX, setInitialX] = useState<number>();
  const [exitX, setExitX] = useState<number>();

  useEffect(() => {
    const getAnimationValues = () => {
      if (direction === 'next') {
        setInitialX(300)
        setExitX(-300)
      } else {
        setInitialX(-300)
        setExitX(300)
      }
    };

    getAnimationValues();
  }, [direction])

  return (
    <motion.div
      key="lap-times-chart"
      initial={{ opacity: 0, y: exitX }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: initialX }}
      transition={commonTransition}
      className="w-full h-full flex justify-center items-center my-auto ">
      <div className="flex justify-center">
        <ResponsiveContainer width={800} aspect={1.75}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            onClick={(data, index) => {
              const lap = data?.activeLabel;
              if (lap !== undefined) {
                onLapSelect(Number.parseInt(lap));
              }
            }}
          >
            <XAxis dataKey="lap_number" tick={false} stroke="white" />
            <YAxis
              domain={[minLapTime, maxLapTime]}
              tickFormatter={formatSecondsToTime}
              stroke="white"
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
      
      <div className="absolute m-5 bottom-0 right-0">
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

    </motion.div>
  );
};

export default LapTimes;