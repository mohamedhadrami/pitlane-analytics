import React, { useRef, useState } from "react";
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
import styles from "../../../styles/telemetry/chart.module.css";
import { DriverParams, LapParams } from "../../../interfaces/openF1";
import LapTimeTooltip from "./LapTimeTooltip";
import { formatSecondsToTime, isValidColor } from "../../../utils/helpers";
import SettingsIcon from "@mui/icons-material/Settings";

interface LapTimeSpeedLineChartProps {
  sessionData: {
    pit: any[];
    position: any[];
    raceControl: any[];
    teamRadio: any[];
    weather: any[];
  };
  driversData: Map<
    string,
    {
      driver: DriverParams;
      laps: LapParams[];
      carData: any[];
      stintData: any[];
    }
  >;
  onLapSelect: (lap_number: number) => void;
}

const LapTimeSpeedLineChart: React.FC<LapTimeSpeedLineChartProps> = ({
  sessionData,
  driversData,
  onLapSelect,
}) => {
  const [isRaceControl, setIsRaceControl] = useState<boolean>(true);

  const handleRaceControl = () => {
    setIsRaceControl(!isRaceControl);
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const cogRef = useRef(null);

  const handleToggleTooltip = () => {
    setShowTooltip((prevState) => !prevState);
  };

  const maxLaps = Math.max(
    ...Array.from(driversData.values()).map(
      (driverData) => driverData.laps.length
    )
  );

  const xData = Array.from({ length: maxLaps }, (_, index) => index + 1);

  const chartData = xData.map((lap_number) => {
    const lapData = { lap_number };

    // Iterate through each driver's data
    Array.from(driversData.values()).forEach((driverData) => {
      const lap = driverData.laps.find(
        (lap) => lap.lap_number === lap_number && lap.lap_duration !== null
        //&& !lap.is_pit_out_lap
      );

      if (lap) {
        lapData[`time_${driverData.driver.name_acronym}`] = lap.lap_duration;

        const raceControlForLap = sessionData.raceControl.filter(
          (message) => message.lap_number === lap_number
        );

        if (isRaceControl) {
          if (raceControlForLap.length > 0) {
            lapData[`raceControl`] = raceControlForLap;
          }
        }

        for (const stint of driverData.stintData) {
          if (lap_number >= stint.lap_start && lap_number <= stint.lap_end) {
            lapData[`tyre_${driverData.driver.name_acronym}`] = stint.compound;
            break;
          }
        }
      }
    });

    return lapData;
  });

  const minLapTime = Math.min(
    ...chartData
      .map((data) =>
        Object.entries(data)
          .filter(
            ([key, value]) => key !== "lap_number" && typeof value === "number"
          )
          .map(([key, value]) => value)
      )
      .flat()
  );
  const maxLapTime = Math.max(
    ...chartData
      .map((data) =>
        Object.values(data).filter((key) => typeof key === "number")
      )
      .flat()
  );

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <span></span>
        <h2>Lap Times</h2>
        <div className={styles.lapTimeSettings}>

            <SettingsIcon className={`rotate`} />

        </div>
      </div>

      {chartData.length > 0 ? (
        <div className={styles.chartContent}>
          <ResponsiveContainer width={800} aspect={1.75}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              onClick={(data, index) => onLapSelect(parseInt(data.activeLabel))}
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
        <p>No data to display</p>
      )}
    </div>
  );
};

export default LapTimeSpeedLineChart;
