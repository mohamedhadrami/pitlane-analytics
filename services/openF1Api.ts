// services/api.ts

import type {
  OpenF1ApiParams,
  OFDateRangeParams,
  OFCarData,
  OFDriver,
  OFInterval,
  OFLap,
  OFLocation,
  OFMeeting,
  OFPit,
  OFPosition,
  OFRaceControl,
  OFSession,
  OFStint,
  OFTeamRadio,
  OFWeather,
} from "@/types/openF1.types"

const fetchApiData = async <T>(
  endpoint: string,
  params?: OpenF1ApiParams,
  dateRangeParams?: OFDateRangeParams
): Promise<T[]> => {
  try {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    let url = `https://api.openf1.org/v1${endpoint}${queryParams ? `?${queryParams}` : ""}`;

    if (dateRangeParams) {
      if (dateRangeParams.date_gt) url += `&date>=${dateRangeParams.date_gt}`;
      if (dateRangeParams.date_lt) url += `&date<=${dateRangeParams.date_lt}`;
    }

    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
const createFetcher = <T>(endpoint: string) => (
  params?: OpenF1ApiParams,
  dateRangeParams?: OFDateRangeParams
): Promise<T[]> => fetchApiData<T>(endpoint, params, dateRangeParams);

/**
 * Some data about each car, at a sample rate of about 3.7 Hz.
 *
 * Basically the telemetry.
 * @param params query parameters
 * @returns data
 */
export const fetchCarData = createFetcher<OFCarData>("/car_data");

/**
 * Provides information about drivers for each session.
 * @param params query parameters
 * @returns data
 */
export const fetchDrivers = createFetcher<OFDriver>("/drivers");

/**
 * Fetches real-time interval data between drivers and their gap to the race leader.
 * Available during races only, with updates approximately every 4 seconds.
 * @param params query parameters
 * @returns data
 */
export const fetchIntervals = createFetcher<OFInterval>("/intervals");

/**
 * Provides detailed information about individual laps.
 * @param params query parameters
 * @returns data
 */
export const fetchLaps = createFetcher<OFLap>("/laps");

/**
 * The approximate location of the cars on the circuit, at a sample rate of about 3.7 Hz.
 * Useful for gauging their progress along the track, but lacks details about lateral placement.
 * @param params query parameters
 * @returns data
 */
export const fetchLocation = createFetcher<OFLocation>("/location");

/**
 * Provides information about meetings.
 *
 * A meeting refers to a Grand Prix or testing weekend and
 * usually includes multiple sessions (practice, qualifying, race, ...).
 * @param params query parameters
 * @returns data
 */
export const fetchMeeting = createFetcher<OFMeeting>("/meetings");

/**
 * Provides information about cars going through the pit lane.
 * @param params query parameters
 * @returns data
 */
export const fetchPit = createFetcher<OFPit>("/pit");

/**
 * Provides driver positions throughout a session, including
 * initial placement and subsequent changes.
 * @param params query parameters
 * @returns data
 */
export const fetchPosition = createFetcher<OFPosition>("/position");

/**
 * Provides information about race control (racing incidents, flags, safety car, ...).
 * @param params query parameters
 * @returns data
 */
export const fetchRaceControl = createFetcher<OFRaceControl>("/race_control");

/**
 * Provides information about sessions.
 * A session refers to a distinct period of track activity during a
 * Grand Prix or testing weekend (practice, qualifying, sprint, race, ...).
 * @param params query parameters
 * @returns data
 */
export const fetchSession = createFetcher<OFSession>("/sessions");

/**
 * Provides information about individual stints.
 * A stint refers to a period of continuous driving by a driver
 * during a session.
 * @param params query parameters
 * @returns data
 */
export const fetchStint = createFetcher<OFStint>("/stints");

/**
 * Provides a collection of radio exchanges between Formula 1 drivers
 * and their respective teams during sessions. Please note that only
 * a limited selection of communications are included, not the complete record
 * of radio interactions.
 * @param params query parameters
 * @returns data
 */
export const fetchTeamRadio = createFetcher<OFTeamRadio>("/team_radio");

/**
 * The weather over the track, updated every minute.
 * @param params query parameters
 * @returns data
 */
export const fetchWeather = createFetcher<OFWeather>("/weather");
