import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryLegend,
  VictoryLabel,
} from "victory";
import styles from "../../../styles/telemetry/chart.module.css";
import { DriverParams, LapParams } from "../../../../interfaces/openF1";
import LapTimeTooltip from "../LapTimeTooltip";
import { formatSecondsToTime } from "../../../../utils/helpers";

interface LapTimeSpeedLineChartProps {
  driversData: Map<
    string,
    { driver: DriverParams; laps: LapParams[]; carData: any[] }
  >;
  onLapSelect: (lap_number: number) => void;
}

const LapTimeSpeedLineChart: React.FC<LapTimeSpeedLineChartProps> = ({
  driversData,
  onLapSelect,
}) => {
  const maxLaps = Math.max(
    ...Array.from(driversData.values()).map(
      (driverData) => driverData.laps.length
    )
  );

  const xData = Array.from({ length: maxLaps }, (_, index) => index + 1);

  const chartData = xData.map((lap_number) => {
    const lapData: { [key: string]: number } = { lap_number };
    Array.from(driversData.values()).forEach((driverData) => {
      const lap = driverData.laps.find(
        (lap) => lap.lap_number === lap_number && lap.lap_duration !== null
      );
      if (lap) {
        lapData[`time_${driverData.driver.name_acronym}`] = lap.lap_duration;
      }
    });
    return lapData;
  });

  const lapTimes = chartData
    .map((data) =>
      Object.values(data).filter((value) => typeof value === "number")
    )
    .flat();
  const averageLapTime =
    lapTimes.reduce((acc, val) => acc + val, 0) / lapTimes.length;

  const threshold = averageLapTime * (1 + 0.3);

  const filteredChartData = chartData.filter((data) => {
    const lapTimes = Object.values(data).filter(
      (value) => typeof value === "number"
    );
    return data;
  });

  const minLapTime = Math.min(
    ...filteredChartData
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
    ...filteredChartData
      .map((data) =>
        Object.values(data).filter((key) => typeof key === "number")
      )
      .flat()
  );

  return (
    <div className={styles.chartContainer}>
      {filteredChartData.length > 0 ? (
        <div className={styles.chartContent}>
          <VictoryChart
            width={800}
            height={400}
            domainPadding={20}
            animate={{ duration: 500 }}
            onClick={(evt) =>
              onLapSelect(filteredChartData[evt.index].lap_number)
            }
          >
            <VictoryLegend
              x={70}
              y={10}
              orientation="horizontal"
              gutter={20}
              style={{ labels: { fontSize: 10 } }}
              data={Array.from(driversData.values()).map((driverData) => ({
                name: driverData.driver.name_acronym,
                symbol: { fill: `#${driverData.driver.team_colour}` },
              }))}
            />
            <VictoryAxis />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => (t)}
              style={{ tickLabels: { fontSize: 16 } }}
            />
            {Array.from(driversData.values()).map((driverData) => (
              <VictoryLine
                key={driverData.driver.name_acronym}
                data={filteredChartData
                    .filter(data => data[`time_${driverData.driver.name_acronym}`] !== undefined) // Filter out data points without lap time data
                    .map((data) => ({
                      x: data.lap_number,
                      y: data[`time_${driverData.driver.name_acronym}`],
                    }))}
                style={{
                  data: {
                    stroke: `#${driverData.driver.team_colour}`,
                    strokeWidth: 2,
                  },
                }}
                labels={({ datum }) => `${datum.y.toFixed(2)}s`}
                labelComponent={<VictoryTooltip />}
              />
            ))}
          </VictoryChart>
        </div>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default LapTimeSpeedLineChart;
