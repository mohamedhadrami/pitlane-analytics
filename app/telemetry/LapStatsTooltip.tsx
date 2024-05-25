// Components/Telemetry/LapStatsTooltip.tsx

import React from "react";
import { formatSecondsToTime, parseISODateAndTime, parseISOTime } from "@/utils/helpers";
import { drsStatus } from "@/interfaces/openF1";

interface LapTimeTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  chartType: string;
  dataNormalization: string;
}

const LapTimeTooltip: React.FC<LapTimeTooltipProps> = ({ active, payload, label, chartType, dataNormalization }) => {

  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-tl from-zinc-800 to-[#111] p-2 rounded-lg max-w-xs">
        <p className="font-light">{dataNormalization == "time" ? `${label} s` : parseISODateAndTime(label)}</p>
        {payload.map((entry: any) => {
          let displayValue = entry.value;
          switch (chartType) {
            case "speed":
              displayValue = entry.value + " km/h";
              break;
            case "throttle":
              displayValue = entry.value + "%";
              break;
            case "brake":
              displayValue = entry.value + "%";
              break;
            case "rpm":
              displayValue = entry.value + " RPM";
              break;
            case "n_gear":
              displayValue = entry.value;
              break;
            case "drs":
              displayValue = drsStatus[entry.value];
              break;
            default:
              break;
          }
          return (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: {displayValue}
            </p>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};

export default LapTimeTooltip;
