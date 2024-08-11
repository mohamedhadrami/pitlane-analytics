// @/components/Telemetry/TrackVisualizerTooltip.tsx

import React from 'react';

interface TrackVisualizerTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const TrackVisualizerTooltip: React.FC<TrackVisualizerTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = (() => {
      switch (data.type) {
        case "Corner":
          return "#FF0000";
        case "Marshal Sector":
          return "#00FF00";
        case "Marshal Light":
          return "#0000FF";
        default:
          return "#FFFFFF"; // Default color if type doesn't match
      }
    })();
    return (
      <div className="bg-gradient-to-tl from-zinc-800 to-[#111] p-2 rounded-lg max-w-xs">
        <p className="font-semibold" style={{ color }}>{data.type} {data.number}</p>
      </div>
    );
  }
  return null;
};

export default TrackVisualizerTooltip;
