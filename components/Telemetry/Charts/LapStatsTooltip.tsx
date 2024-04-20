// Components/Telemetry/LapStatsTooltip.tsx

import React from "react";
import styles from "../../../styles/telemetry/chart.module.css";
import { formatSecondsToTime, parseISOTime } from "../../../utils/helpers";
import { drsStatus } from "../../../interfaces/openF1";

interface LapTimeTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  chartType: string;
}

const LapTimeTooltip: React.FC<LapTimeTooltipProps> = ({ active, payload, label, chartType }) => {

  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p>{formatSecondsToTime(label)}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {chartType === "drs" ? (
              <>{entry.name}: {drsStatus[entry.value]}</>
            ) : (
              <>{entry.name}: {entry.value}</>
            )}
          </p>
        ))}
      </div>
    );
  }
};

export default LapTimeTooltip;
