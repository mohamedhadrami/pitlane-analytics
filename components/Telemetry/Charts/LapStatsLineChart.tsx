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
import styles from "../../../styles/telemetry/chart.module.css";
import {
  CarDataParams,
  DriverParams,
  LapParams,
  LocationParams,
  segmentColor,
} from "../../../interfaces/openF1";
import LapStatsTooltip from "./LapStatsTooltip";
import HtmlTooltip from "../SettingsIconTooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  formatSecondsToTime,
  isValidColor,
  parseISOTime,
} from "../../../utils/helpers";
import { calculateAverages } from "../../../utils/telemetryUtils";
import AverageLapStats from "../AverageLapStats";

interface ExtendedCarDataParams extends CarDataParams {
  lap_time: number;
}

interface LapStatsLineChartProps {
  driversData: Map<
    string,
    {
      driver: DriverParams;
      laps: LapParams[];
      carData: ExtendedCarDataParams[];
      locationData: LocationParams[];
      raceControl: any[];
      chartData: any[];
    }
  >;
  lapSelected: number;
}

const Overlay = () => {
  return <div className={styles.dataOverlay}>Hello</div>;
};

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
      [parameter]: !prevVisibleCharts[parameter],
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

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const handleChartHover = (isHovering) => {
    setIsOverlayVisible(isHovering);
  };

  const xData = new Set<number>();

  Array.from(driversData.values()).forEach((driverData) => {
    driverData.carData.forEach((carDatum) => {
      xData.add(carDatum.lap_time);
    });
  });

  const driversDataWithArrays = Array.from(driversData.entries()).map(
    ([driverId, driverData]) => {
      const driverChartData = [];
      Array.from(xData).forEach((time) => {
        const carsData = { time };
        const carDatum = driverData.carData.find(
          (car) => car.lap_time === time
        );
        if (carDatum) {
          Object.keys(visibleCharts).forEach((parameter) => {
            carsData[`${parameter}_${driverData.driver.name_acronym}`] =
              carDatum[parameter];
          });
          carsData[`time_${driverData.driver.name_acronym}`] =
            carDatum.lap_time;
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

  const updatedDriversData: Map<
    string,
    {
      driver: DriverParams;
      laps: LapParams[];
      carData: ExtendedCarDataParams[];
      locationData: LocationParams[];
      chartData: any[];
    }
  > = new Map(driversDataWithArrays);

  const renderCharts = () => {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <span></span>
          <h2>Telemetry Visualization Lap {lapSelected}</h2>
          <div className={styles.lapTimeSettings}>
            
            <SettingsIcon className={`rotate`} />

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

        {/*isOverlayVisible && <Overlay />*/}

        <div className={styles.charts}>
          {Object.keys(visibleCharts).map((parameter) => (
            <div key={parameter} className={styles.chartContainer}>
              <LineChart
                width={800}
                height={300}
                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                style={{ display: visibleCharts[parameter] ? "block" : "none" }}
                onMouseEnter={() => handleChartHover(true)}
                onMouseLeave={() => handleChartHover(false)}
              >
                <CartesianGrid />
                <XAxis
                  dataKey="time"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={true}
                  tickFormatter={formatSecondsToTime}
                />
                <YAxis
                  label={{
                    value: `${parameterDisplayText[parameter]}`,
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
          <AverageLapStats driversData={driversData} />
        </div>
        <div>
          <h2>Segments</h2>
          {driversData && Array.from(driversData.values()).map((driver) => (
            <div key={driver.driver_id}>
              <p>{driver.laps[lapSelected - 1].lap_number}</p>
              <div style={{ display: "flex" }}>
                {/* Display boxes for each segment in sector 1 */}
                {driver.laps[lapSelected - 1].segments_sector_1?.map((segment, index) => (
                  <div
                    key={index}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: segmentColor[segment],
                      marginRight: "5px"
                    }}
                  ></div>
                ))}
              </div>
              <div style={{ display: "flex" }}>
                {/* Display boxes for each segment in sector 2 */}
                {driver.laps[lapSelected - 1].segments_sector_2?.map((segment, index) => (
                  <div
                    key={index}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: segmentColor[segment],
                      marginRight: "5px"
                    }}
                  ></div>
                ))}
              </div>
              <div style={{ display: "flex" }}>
                {/* Display boxes for each segment in sector 3 */}
                {driver.laps[lapSelected - 1].segments_sector_3?.map((segment, index) => (
                  <div
                    key={index}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: segmentColor[segment],
                      marginRight: "5px"
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>


      </div>
    );
  };

  return <div>{renderCharts()}</div>;
};

export default LapStatsLineChart;

// <p>{segmentColor[segment]}</p>