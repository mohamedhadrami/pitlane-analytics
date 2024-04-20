// Components/Telemetry/LapTimeTooltip.tsx

import React from "react";
import styles from "../../../styles/telemetry/chart.module.css";
import {
  HardCompound,
  InterCompound,
  MediumCompound,
  SoftCompound,
  WetCompound,
} from "../../Tyres";
import { RaceControlParams } from "../../../interfaces/openF1";
import { formatSecondsToTime } from "../../../utils/helpers";

interface LapTimeTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
}

const getCompoundComponent = (compoundText: string) => {
  switch (compoundText) {
    case "SOFT":
      return <SoftCompound />;
    case "MEDIUM":
      return <MediumCompound />;
    case "HARD":
      return <HardCompound />;
    case "INTERMEDIATE":
      return <InterCompound />;
    case "WET":
      return <WetCompound />;
    case "UNKNOWN":
      return "U";
    case "TEST_UNKNOWN":
      return "T";
    default:
      return null;
  }
};

const LapTimeTooltip: React.FC<LapTimeTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  //console.log(payload)
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p>Lap {label}</p>
        {payload.map((entry: any) => (
          <div className={styles.tooltipDriver}>
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: {formatSecondsToTime(entry.value)}
            </p>
            <div className={styles.tooltipTyre}>
              {getCompoundComponent(entry.payload[`tyre_${entry.name}`])}
            </div>
          </div>
        ))}
        {payload[0].payload.raceControl?.map((event: RaceControlParams) => (
          <div style={{maxWidth: '400px'}}>
            - {event.message}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default LapTimeTooltip;
