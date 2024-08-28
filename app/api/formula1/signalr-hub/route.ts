// /app/api/formula1/signalr-hub/route.ts

import { NextResponse } from 'next/server';
import WebSocket from 'ws';
import zlib from 'zlib';
import { updateState } from '../state';

const signalrUrl = 'livetiming.formula1.com/signalr';
const signalrHub = 'Streaming';
let socket: WebSocket | null = null;
let isRunning = false;

const deepObjectMerge = (original: any = {}, modifier: any) => {
  if (!modifier) return original;
  const copy = { ...original };
  for (const [key, value] of Object.entries(modifier)) {
    const valueIsObject =
      typeof value === 'object' && !Array.isArray(value) && value !== null;
    if (valueIsObject && !!Object.keys(value).length) {
      copy[key] = deepObjectMerge(copy[key], value);
    } else {
      copy[key] = value;
    }
  }
  return copy;
};

const parseCompressed = (data: string) =>
  JSON.parse(zlib.inflateRawSync(Buffer.from(data, 'base64')).toString());

const handleSignalRMessage = (data: string) => {
  try {
    const parsed = JSON.parse(data);

    if (Array.isArray(parsed.M)) {
      for (const message of parsed.M) {
        if (message.M === 'feed') {
          let [field, value] = message.A;

          if (field === 'CarData.z' || field === 'Position.z') {
            const [parsedField] = field.split('.');
            field = parsedField;
            value = parseCompressed(value);
          }

          const newState = deepObjectMerge({}, { [field]: value });
          //console.log('Updating state with:', newState);
          updateState(newState);
        }
      }
    } else if (Object.keys(parsed.R ?? {}).length && parsed.I === '1') {
      if (parsed.R['CarData.z'])
        parsed.R['CarData'] = parseCompressed(parsed.R['CarData.z']);

      if (parsed.R['Position.z'])
        parsed.R['Position'] = parseCompressed(parsed.R['Position.z']);

      const newState = deepObjectMerge({}, parsed.R);
      //console.log('Updating state with:', newState);
      updateState(newState);
    }
  } catch (e) {
    console.error(`Could not update data: ${e}`);
  }
};

const setupStream = async () => {
  if (isRunning) return;

  console.log(`[${signalrUrl}] Connecting to live timing stream`);
  isRunning = true;

  const hub = encodeURIComponent(JSON.stringify([{ name: signalrHub }]));
  const negotiation = await fetch(
    `https://${signalrUrl}/negotiate?connectionData=${hub}&clientProtocol=1.5`
  );
  const cookie =
    negotiation.headers.get('Set-Cookie') ?? negotiation.headers.get('set-cookie');
  const { ConnectionToken } = await negotiation.json();

  if (cookie && ConnectionToken) {
    console.log(`[${signalrUrl}] HTTP negotiation complete`);

    socket = new WebSocket(
      `wss://${signalrUrl}/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${encodeURIComponent(
        ConnectionToken
      )}&connectionData=${hub}`,
      [],
      {
        headers: {
          'User-Agent': 'BestHTTP',
          'Accept-Encoding': 'gzip,identity',
          Cookie: cookie,
        },
      }
    );

    socket.on('open', () => {
      console.log(`[${signalrUrl}] WebSocket open`);

      socket?.send(
        JSON.stringify({
          H: signalrHub,
          M: 'Subscribe',
          A: [
            [
              'SessionInfo',
              'ArchiveStatus',
              'TrackStatus',
              'SessionData',
              'ContentStreams',
              'ChampionshipPrediction',
              'AudioStreams',
              'DriverList',
              'TimingDataF1',
              'TopThree',
              'TimingData',
              'LapSeries',
              'TimingAppData',
              'TimingStats',
              'ExtrapolatedClock',
              'Position.z',
              'CarData.z',
              'TyreStintSeries',
              'LapCount',
              'DriverRaceInfo',
              'SessionStatus',
              'Heartbeat',
              'WeatherData',
              'WeatherDataSeries',
              'TeamRadio',
              'TlaRcm',
              'RaceControlMessages',
              'CurrentTyres',
              'PitLaneTimeCollection'
            ],
          ],
          I: 1,
        })
      );
    });

    socket.on('message', (data) => {
      handleSignalRMessage(data.toString());
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      socket?.close();
      isRunning = false;
    });

    socket.on('close', () => {
      console.log('WebSocket closed');
      isRunning = false;
      socket = null;
    });
  } else {
    console.log(
      `[${signalrUrl}] HTTP negotiation failed. Is there a live session?`
    );
    isRunning = false;
    socket = null;
  }
};

export async function GET() {
  await setupStream();
  return NextResponse.json({ status: 'SignalR hub initialized' });
}
