// @/app/telemetry/LapTimeTooltip

import React from "react";
import {
  HardCompound,
  InterCompound,
  MediumCompound,
  SoftCompound,
  WetCompound,
} from "../../components/Tyres";
import { RaceControlParams } from "../../interfaces/openF1";
import { formatSecondsToTime } from "../../utils/helpers";

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
  if (active && payload && payload.length) {
    return (
      <div key={`Lap-${label}`} className="bg-gradient-to-tl from-zinc-800 to-[#111] p-2 rounded-lg max-w-xs">
        <p className="font-light">Lap {label}</p>
        {payload.map((entry: any) => (
          <div className="flex gap-5 justify-between" key={`Lap-time-${entry.name}`}>
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: {entry.payload.interpolated ? "Outlier Lap" : formatSecondsToTime(entry.value)}
            </p>
            <div className="max-w-5">
              {getCompoundComponent(entry.payload[`tyre_${entry.name}`])}
            </div>
          </div>
        ))}
        {payload[0].payload.raceControl?.map((event: RaceControlParams) => (
          <div key={`${event.category}-${event.date}`} className="max-w-96">
            - {event.message}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default LapTimeTooltip;
