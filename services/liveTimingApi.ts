// @/services/liveTiming.ts

import type { LiveArchiveStatus, LiveLapCount, LiveTrackStatus } from "@/types/liveTiming";

const fetchApiData = async (endpoint: string) => {
  try {
    const url = `https://livetiming.formula1.com/static${endpoint}`;
    const response = await fetch(`/api/proxy?url=${url}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching F1 Live Timing data:', error);
    throw error;
  }
}

export const fetchLiveSchedule = async (year: number | string) => {
  const endpoint = `/${year}/Index.json`;
  const data = await fetchApiData(endpoint);
  return data;
}

export const fetchLiveSessionPath = async (
  year: number | string,
  meetingKey: number | string,
  sessionKey: number | string
): Promise<string | undefined> => {
  const res = await fetchLiveSchedule(year);

  for (const meet of res.Meetings) {
    if (meet.Key === meetingKey) {
      for (const sesh of meet.Sessions) {
        if (sesh.Key === sessionKey) {
          return sesh.Path;
        }
      }
    }
  }

  return undefined;
};


export const fetchLiveArchiveStatus = async (sessionPath: string): Promise<LiveArchiveStatus> => {
  const endpoint = `/${sessionPath}ArchiveStatus.json`;
  const data = await fetchApiData(endpoint);
  return data;
}

export const fetchLiveTrackStatus = async (sessionPath: string): Promise<LiveTrackStatus> => {
  const endpoint = `/${sessionPath}TrackStatus.json`;
  const data = await fetchApiData(endpoint);
  return data;
}

export const fetchLiveLapCount = async (sessionPath: string): Promise<LiveLapCount> => {
  const endpoint = `/${sessionPath}LapCount.json`;
  const data = await fetchApiData(endpoint);
  return data;
}
