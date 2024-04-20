import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import styles from "../../../styles/telemetry/chart.module.css";
import { DriverParams, LapParams } from "../../../../interfaces/openF1";
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
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart<"line"> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const data = generateChartData(driversData);
        const chartLabels = data.map((data) => data.lap_number);

        const datasets = generateDatasets(data, driversData);

        const newChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: chartLabels,
            datasets: datasets,
          },
          options: {
            onClick: (event, activeElements) => {
              if (activeElements.length > 0) {
                const index = activeElements[0].index;
                const lapNumber = chartLabels[index];
                onLapSelect(chartLabels[index]);
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Lap Number",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Lap Time",
                },
                ticks: {
                  callback: formatSecondsToTime,
                },
              },
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            plugins: {
              tooltip: {
                mode: 'index', // Display tooltip for the nearest item
                intersect: true,
                callbacks: {
                  label: function (context) {
                    let label = '';
                    if (context.dataset.label) {
                      label += context.dataset.label + ': ';
                    }
                    label += formatSecondsToTime(context.parsed.y);
                    return label;
                  }
                }
              }
            }
          },
        });
        setChartInstance(newChartInstance);
      }
    }
  }, [driversData, onLapSelect]);

  const generateChartData = (
    driversData: LapTimeSpeedLineChartProps["driversData"]
  ) => {
    const maxLaps = Math.max(
      ...Array.from(driversData.values()).map(
        (driverData) => driverData.laps.length
      )
    );

    const chartData = Array.from({ length: maxLaps }, (_, index) => {
      const lap_number = index + 1;
      const lapData: { [key: string]: any } = { lap_number };

      Array.from(driversData.values()).forEach((driverData) => {
        const lap = driverData.laps.find(
          (lap) =>
            lap.lap_number === lap_number && lap.lap_duration !== null
        );
        if (lap) {
          lapData[`time_${driverData.driver.name_acronym}`] = lap.lap_duration;
        }
      });

      return lapData;
    });

    return chartData;
  };

  const generateDatasets = (
    chartData: { [key: string]: any }[],
    driversData: LapTimeSpeedLineChartProps["driversData"]
  ) => {
    const datasets = Array.from(driversData.values()).map((driverData) => {
      const dataset = {
        label: driverData.driver.name_acronym,
        data: [],
        borderColor: driverData.driver.team_colour
          ? `#${driverData.driver.team_colour}`
          : "#ffffff",
        fill: false,
      };

      for (let i = 0; i < chartData.length; i++) {
        const lapData = chartData[i];
        const lapTime = lapData[`time_${driverData.driver.name_acronym}`];
        dataset.data.push(lapTime);
      }

      return dataset;
    });

    return datasets;
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartContent}>
        <canvas ref={chartRef} width={800}/>
      </div>
    </div>
  );
};

export default LapTimeSpeedLineChart;
