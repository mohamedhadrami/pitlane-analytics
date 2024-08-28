// @/components/CircuitMap.tsx

import React, { useEffect, useState } from 'react';
import { mvCircuit, trackElement } from '@/interfaces/multiviewer';
import Loading from '../Loading';
import { LiveDriverList, LivePosition } from '@/interfaces/liveTiming.type';

interface CircuitMapProps {
  circuitData: mvCircuit | undefined;
  drivers: LiveDriverList;
  positions: LivePosition;
}

interface ScaledPosition {
  labelX?: string | number | undefined;
  labelY?: string | number | undefined;
  x: number;
  y: number;
}

const TrackMap: React.FC<CircuitMapProps> = ({ circuitData, drivers, positions }) => {
  const [scaledCorners, setScaledCorners] = useState<ScaledPosition[]>([]);
  const [scaledLights, setScaledLights] = useState<ScaledPosition[]>([]);
  const [scaledTrack, setScaledTrack] = useState<ScaledPosition[]>([]);
  const [scaledDrivers, setScaledDrivers] = useState<{ [key: string]: ScaledPosition }>({});

  useEffect(() => {
    if (!circuitData) return;

    const { scaleX, scaleY, offsetX, offsetY } = calculateScaling(circuitData);

    const scaledTrack = circuitData.x.map((x, i) => ({
      x: (x - Math.min(...circuitData.x)) * scaleX + offsetX,
      y: (circuitData.y[i] - Math.min(...circuitData.y)) * scaleY + offsetY,
    }));
    setScaledTrack(scaledTrack);

    const scaledCorners = circuitData.corners.map((corner, index) => {
      const cornerPos = {
        x: (corner.trackPosition.x - Math.min(...circuitData.x)) * scaleX + offsetX,
        y: (corner.trackPosition.y - Math.min(...circuitData.y)) * scaleY + offsetY,
      };

      let offsetXDir = 0;
      let offsetYDir = 0;

      if (index > 0) {
        const prevCorner = scaledTrack[index - 1];
        const dx = cornerPos.x - prevCorner.x;
        const dy = cornerPos.y - prevCorner.y;

        // Determine direction to offset the corner number
        offsetXDir = dy > 0 ? 10 : -10;
        offsetYDir = dx > 0 ? -10 : 10;
      }

      return {
        ...cornerPos,
        labelX: cornerPos.x + offsetXDir,
        labelY: cornerPos.y + offsetYDir,
      };
    });
    setScaledCorners(scaledCorners);

    const scaledLights = circuitData.marshalLights.map(light => ({
      x: (light.trackPosition.x - Math.min(...circuitData.x)) * scaleX + offsetX,
      y: (light.trackPosition.y - Math.min(...circuitData.y)) * scaleY + offsetY,
    }));
    setScaledLights(scaledLights);

    if (positions && positions.Position && positions.Position.length > 0) {
      const latestPositions = positions.Position[positions.Position.length - 1].Entries;
      const scaledDrivers: { [key: string]: ScaledPosition } = {};

      Object.keys(latestPositions).forEach(driverId => {
        const driverPosition = latestPositions[driverId];
        scaledDrivers[driverId] = {
          x: (driverPosition.X - Math.min(...circuitData.x)) * scaleX + offsetX,
          y: (driverPosition.Y - Math.min(...circuitData.y)) * scaleY + offsetY,
        };
      });

      setScaledDrivers(scaledDrivers);
    }

  }, [circuitData, positions]);

  return (
    <div>
      {circuitData ? (
        <svg width="1000" height="900">
          {/* Circuit Track */}
          <polyline
            points={scaledTrack.map(pos => `${pos.x},${pos.y}`).join(' ')}
            stroke="#FFFFFF"
            strokeWidth="20"
            fill="none"
          />
          <polyline
            points={scaledTrack.map(pos => `${pos.x},${pos.y}`).join(' ')}
            stroke="#000000"
            strokeWidth="10"
            fill="none"
          />

          {/* Corners */}
          {scaledCorners.map((corner, index) => (
            <text
              key={`corner-${index}`}
              x={corner.labelX}
              y={corner.labelY}
              fill="white"
              fontSize="14"
            >
              {circuitData.corners[index].number}
            </text>
          ))}

          {/* Marshal Lights */}
          {scaledLights.map((light, index) => (
            <circle
              key={`light-${index}`}
              cx={light.x}
              cy={light.y}
              r="5"
              fill="yellow"
              stroke="black"
              strokeWidth="2"
            />
          ))}

          {/* Driver Positions */}
          {Object.keys(scaledDrivers).map(driverId => {
            const driver = drivers[driverId];
            return (
              <g key={`driver-group-${driverId}`}>
                <circle
                  key={`driver-${driverId}`}
                  cx={scaledDrivers[driverId].x}
                  cy={scaledDrivers[driverId].y}
                  r="5"
                  fill={`#${driver.TeamColour}`}
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  key={`driver-${driverId}-name`}
                  x={scaledDrivers[driverId].x + 5}
                  y={scaledDrivers[driverId].y + 5}
                  fill={`#${driver.TeamColour}`}
                  fontSize="14"
                >
                  {driver.Tla}
                </text>
              </g>
            );
          })}

        </svg>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default TrackMap;

const calculateScaling = (circuitData: mvCircuit) => {
  const { x, y } = circuitData;
  const [minX, maxX] = [Math.min(...x), Math.max(...x)];
  const [minY, maxY] = [Math.min(...y), Math.max(...y)];

  const canvasWidth = 800;
  const canvasHeight = 800;
  const scaleX = canvasWidth / (maxX - minX);
  const scaleY = canvasHeight / (maxY - minY);

  const offsetX = 50;
  const offsetY = 50;

  return { scaleX, scaleY, offsetX, offsetY };
};