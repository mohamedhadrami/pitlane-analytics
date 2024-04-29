// Components/Telemetry/LapStatsTooltip.tsx

import React from "react";
import { formatSecondsToTime, parseISOTime } from "@/utils/helpers";
import { drsStatus } from "@/interfaces/openF1";

interface LapTimeTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  chartType: string;
}

const LapTimeTooltip: React.FC<LapTimeTooltipProps> = ({ active, payload, label, chartType }) => {

  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-tl from-zinc-800 to-[#111] p-2 rounded-lg max-w-xs">
        <p className="font-light">{formatSecondsToTime(label)}</p>
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
