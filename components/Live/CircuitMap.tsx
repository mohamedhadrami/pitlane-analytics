// @/components/Live/CircuitMap.tsx

import { useEffect, useState } from "react";
import clsx from "clsx";
import { LiveDriverList, LiveTimingDataF1, LivePosition, LiveTrackStatus, LiveRaceControlMessage, LivePositionItemData, objectEntries, LiveRaceControlMessages } from "@/types/liveTiming.types";
import type { mvCircuit } from "@/types/multiviewer";
import utc from 'moment';

// This is basically shamelessly copied from
// https://github.com/tdjsnelling/monaco

// Completely ripped off F1-Dash
// https://github.com/slowlydev/f1-dash/tree/main

type Props = {
  circuitData: mvCircuit;
  drivers: LiveDriverList;
  timingDrivers: LiveTimingDataF1;
  positions: LivePosition;

  trackStatus: LiveTrackStatus;
  raceControlMessages: LiveRaceControlMessages;
};

type TrackPosition = {
  x: number;
  y: number;
}

const space = 1000;

const rad = (deg: number) => deg * (Math.PI / 180);

const rotate = (x: number, y: number, a: number, px: number, py: number) => {
  const c = Math.cos(rad(a));
  const s = Math.sin(rad(a));

  const new_x = x - px;
  const new_y = y - py;

  const newX = new_x * c - y * s;
  const newY = new_y * c + x * s;

  return { y: newX + px, x: newY + py };
};

type Sector = {
  number: number;
  start: TrackPosition;
  end: TrackPosition;
  points: TrackPosition[];
};

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

const findMinDistance = (point: TrackPosition, points: TrackPosition[]) => {
  let min = Number.POSITIVE_INFINITY;
  let minIndex = -1;
  for (let i = 0; i < points.length; i++) {
    const distance = calculateDistance(point.x, point.y, points[i].x, points[i].y);
    if (distance < min) {
      min = distance;
      minIndex = i;
    }
  }
  return minIndex;
};

const createSectors = (map: mvCircuit) => {
  const sectors: Sector[] = [];
  const points: TrackPosition[] = map.x.map((x, index) => ({ x, y: map.y[index] }));

  for (let i = 0; i < map.marshalSectors.length; i++) {
    sectors.push({
      number: i + 1,
      start: map.marshalSectors[i].trackPosition,
      end: map.marshalSectors[i + 1] ? map.marshalSectors[i + 1].trackPosition : map.marshalSectors[0].trackPosition,
      points: [],
    });
  }

  const dividers: number[] = sectors.map((s) => findMinDistance(s.start, points));
  for (let i = 0; i < dividers.length; i++) {
    const start = dividers[i];
    const end = dividers[i + 1] ? dividers[i + 1] : dividers[0];
    if (start < end) {
      sectors[i].points = points.slice(start, end + 1);
    } else {
      sectors[i].points = points.slice(start).concat(points.slice(0, end + 1));
    }
  }

  return sectors;
};

const sortUtc = (a: LiveRaceControlMessage, b: LiveRaceControlMessage) => {
  return utc(b.Utc).diff(utc(a.Utc));
};

const findYellowSectors = (messages: LiveRaceControlMessage[] | undefined): Set<number> => {
  const msgs = messages?.sort(sortUtc).filter((msg) => {
    return msg.Flag === "YELLOW" || msg.Flag === "DOUBLE YELLOW" || msg.Flag === "CLEAR";
  });

  if (!msgs) {
    return new Set();
  }

  const done: Set<number> = new Set();
  const sectors: Set<number> = new Set();
  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i];
    if (msg.Scope === "Track" && msg.Flag !== "CLEAR") {
      // Spam with sectors so all sectors are yellow no matter what
      // number of sectors there really are
      for (let j = 0; j < 100; j++) {
        sectors.add(j);
      }
      return sectors;
    }
    if (msg.Scope === "Sector") {
      if (!msg.Sector || done.has(msg.Sector)) {
        continue;
      }
      if (msg.Flag === "CLEAR") {
        done.add(msg.Sector);
      } else {
        sectors.add(msg.Sector);
      }
    }
  }
  return sectors;
};

type RenderedSector = {
  number: number;
  d: string;
  color: string;
  stroke_width: number;
  pulse?: number;
};

const priorizeColoredSectors = (a: RenderedSector, b: RenderedSector) => {
  if (a.color === "stroke-white" && b.color !== "stroke-white") {
    return -1;
  }
  if (a.color !== "stroke-white" && b.color === "stroke-white") {
    return 1;
  }
  return a.number - b.number;
};

type StatusMessage = {
  message: string;
  color: string;
  trackColor: string;
  bySector?: boolean;
  pulse?: number;
  hex: string;
};

type MessageMap = {
  [key: string]: StatusMessage;
};

export const getTrackStatusMessage = (statusCode: number | undefined): StatusMessage | null => {
  const messageMap: MessageMap = {
    1: { message: "Track Clear", color: "bg-emerald-500", trackColor: "stroke-white", hex: "#34b981" },
    2: {
      message: "Yellow Flag",
      color: "bg-yellow-500",
      trackColor: "stroke-yellow-500",
      bySector: true,
      hex: "#f59e0c",
    },
    3: { message: "Flag", color: "bg-yellow-500", trackColor: "stroke-yellow-500", bySector: true, hex: "#f59e0c" },
    4: { message: "Safety Car", color: "bg-yellow-500", trackColor: "stroke-yellow-500", hex: "#f59e0c" },
    5: { message: "Red Flag", color: "bg-red-500", trackColor: "stroke-red-500", hex: "#ef4444" },
    6: { message: "VSC Deployed", color: "bg-yellow-500", trackColor: "stroke-yellow-500", hex: "#f59e0c" },
    7: { message: "VSC Ending", color: "bg-yellow-500", trackColor: "stroke-yellow-500", hex: "#f59e0c" },
  };

  return statusCode ? messageMap[statusCode] ?? messageMap[0] : null;
};

const rotationFIX = 90;

export default function CircuitMap({
  circuitData,
  drivers,
  timingDrivers,
  trackStatus,
  raceControlMessages,
  positions,
}: Props) {
  const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);

  const [rotation, setRotation] = useState<number>(0);

  const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
  const [[centerX, centerY], setCenter] = useState<(null | number)[]>([null, null]);

  useEffect(() => {
    const centerX = (Math.max(...circuitData.x) - Math.min(...circuitData.x)) / 2;
    const centerY = (Math.max(...circuitData.y) - Math.min(...circuitData.y)) / 2;

    const fixedRotation = circuitData.rotation + rotationFIX;

    const sectors = createSectors(circuitData).map((s) => {
      const start = rotate(s.start.x, s.start.y, fixedRotation, centerX, centerY);
      const end = rotate(s.end.x, s.end.y, fixedRotation, centerX, centerY);
      const points = s.points.map((p) => rotate(p.x, p.y, fixedRotation, centerX, centerY));
      return {
        ...s,
        start,
        end,
        points,
      };
    });

    const rotatedPoints = circuitData.x.map((x, index) => rotate(x, circuitData.y[index], fixedRotation, centerX, centerY));

    const pointsX = rotatedPoints.map((item) => item.x);
    const pointsY = rotatedPoints.map((item) => item.y);

    const cMinX = Math.min(...pointsX) - space;
    const cMinY = Math.min(...pointsY) - space;
    const cWidthX = Math.max(...pointsX) - cMinX + space * 2;
    const cWidthY = Math.max(...pointsY) - cMinY + space * 2;

    setCenter([centerX, centerY]);
    setBounds([cMinX, cMinY, cWidthX, cWidthY]);
    setSectors(sectors);
    setPoints(rotatedPoints);
    setRotation(fixedRotation);
  }, [circuitData]);

  const [renderedSectors, setRenderedSectors] = useState<RenderedSector[]>([]);
  useEffect(() => {
    const status = getTrackStatusMessage(trackStatus?.Status ? Number.parseInt(trackStatus?.Status) : undefined);
    let color: (sector: Sector) => string;
    if (status?.bySector) {
      const yellowSectors = findYellowSectors(raceControlMessages.Messages);
      color = (sector) => {
        if (yellowSectors.has(sector.number)) {
          return status?.trackColor || "stroke-white";
        }
          return "stroke-white";
      };
    } else {
      color = (_) => status?.trackColor || "stroke-white";
    }

    const newSectors: RenderedSector[] = sectors
      .map((sector) => {
        const start = `M${sector.points[0].x},${sector.points[0].y}`;
        const rest = sector.points.map((point) => `L${point.x},${point.y}`).join(" ");

        const c = color(sector);
        return {
          number: sector.number,
          d: `${start} ${rest}`,
          color: c,
          stroke_width: c === "stroke-white" ? 60 : 120,
          pulse: status?.pulse,
        };
      })
      .sort(priorizeColoredSectors);

    setRenderedSectors(newSectors);
  }, [trackStatus, raceControlMessages, sectors]);

  if (!points || !minX || !minY || !widthX || !widthY)
    return (
      <div className="h-full w-full p-2" style={{ minHeight: "35rem" }}>
        <div className="h-full w-full animate-pulse rounded-lg bg-zinc-800" />
      </div>
    );

  return (
    <svg
      viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
      className="h-full w-full xl:max-h-screen"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="stroke-gray-800"
        strokeWidth={300}
        strokeLinejoin="round"
        fill="transparent"
        d={`M${points[0].x},${points[0].y} ${points.map((point) => `L${point.x},${point.y}`).join(" ")}`}
      />

      {renderedSectors.map((sector) => {
        const style = sector.pulse
          ? {
            animation: `${sector.pulse * 100}ms linear infinite pulse`,
          }
          : {};
        return (
          <path
            key={`map.sector.${sector.number}`}
            className={sector.color}
            strokeWidth={sector.stroke_width}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="transparent"
            d={sector.d}
            style={style}
          />
        );
      })}

      {centerX && centerY && positions && drivers && (
        <>
          {/* 241 is safety car */}
          {/* theres also 242 and 243 which might be medical car and something else  */}
          {positions?.Position[positions?.Position.length - 1].Entries["241"] && (
            <CarDot
              key={"map.car.241"}
              name="Safety Car"
              pit={false}
              hidden={false}
              pos={positions?.Position[positions?.Position.length - 1].Entries["241"]}
              color={undefined}
              rotation={rotation}
              centerX={centerX}
              centerY={centerY}
            />
          )}

          {objectEntries(drivers)
            .reverse()
            .filter((driver) => !!positions?.Position[positions?.Position.length - 1].Entries[driver.RacingNumber].X && !!positions?.Position[positions?.Position.length - 1].Entries[driver.RacingNumber].Y)
            .map((driver) => {
              const timingDriver = timingDrivers?.Lines[driver.RacingNumber];
              const hidden = timingDriver
                ? timingDriver.KnockedOut || timingDriver.Stopped || timingDriver.Retired
                : false;
              const pit = timingDriver ? timingDriver.InPit : false;

              return (
                <CarDot
                  key={`map.driver.${driver.RacingNumber}`}
                  name={driver.Tla}
                  color={driver.TeamColour}
                  pit={pit}
                  hidden={hidden}
                  pos={positions?.Position[positions?.Position.length - 1].Entries[driver.RacingNumber]}
                  rotation={rotation}
                  centerX={centerX}
                  centerY={centerY}
                />
              );
            })}
        </>
      )}
    </svg>
  );
}

type CarDotProps = {
  name: string;
  color: string | undefined;

  pit: boolean;
  hidden: boolean;

  pos: LivePositionItemData;
  rotation: number;

  centerX: number;
  centerY: number;
};

const CarDot = ({ pos, name, color, pit, hidden, rotation, centerX, centerY }: CarDotProps) => {
  const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);
  const transform = [`translateX(${rotatedPos.x}px)`, `translateY(${rotatedPos.y}px)`].join(" ");

  return (
    <g
      className={clsx("fill-zinc-700", { "opacity-30": pit }, { "!opacity-0": hidden })}
      style={{
        transition: "all 1s linear",
        transform,
        ...(color && { fill: `#${color}` }),
      }}
    >
      <circle id={"map.driver.circle"} r={120} />
      <text
        id={"map.driver.text"}
        fontWeight="bold"
        fontSize={120 * 3}
        style={{
          transform: "translateX(150px) translateY(-120px)",
        }}
      >
        {name}
      </text>
    </g>
  );
};