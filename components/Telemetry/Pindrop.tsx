// @/components/Telemetry/PindropShape.tsx

import React from 'react';

interface PindropShapeProps {
  cx?: number;
  cy?: number;
  fill?: string;
}

const PindropShape: React.FC<PindropShapeProps> = ({ cx, cy, fill }) => {
  if (!cx || !cy) return null;

  const width = 20;
  const height = 20;

  return (
    <svg x={cx - width / 2} y={cy - height} width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 2C8.1 2 5 5.1 5 9c0 3.7 4.3 9.1 6.1 11.3.5.6 1.4.6 2 0C14.7 18.1 19 12.7 19 9c0-3.9-3.1-7-7-7z"/>
    </svg>
  );
};

export default PindropShape;
