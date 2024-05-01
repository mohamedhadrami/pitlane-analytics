// services/api.ts

import {
  CarDataParams,
  DateRangeParams,
  DriverParams,
  IntervalParams,
  LapParams,
  LocationParams,
  MeetingParams,
  PitParams,
  PositionParams,
  RaceControlParams,
  SessionParams,
  StintParams,
  TeamRadioParams,
  WeatherParams,
} from "@/interfaces/openF1"

const fetchApiData = async (
  endpoint: string,
  params?: any,
  dateRangeParams?: DateRangeParams
) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    let url = `https://api.openf1.org/v1${endpoint}${queryParams ? `?${queryParams}` : ""
      }`;
    if (dateRangeParams) {
      if (dateRangeParams.date_gt) url += `&date>=${dateRangeParams.date_gt}`;
      if (dateRangeParams.date_lt) url += `&date<=${dateRangeParams.date_lt}`;
    }
    const response = await fetch(url);
    console.log(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

/**
 * Some data about each car, at a sample rate of about 3.7 Hz.
 *
 * Basically the telemetry
 * @param params query parameters
 * @returns data
 */
export const fetchCarData = async (
  params: CarDataParams,
  dateRangeParams?: DateRangeParams
) => {
  const endpoint = "/car_data";
  const data = await fetchApiData(endpoint, params, dateRangeParams);
  return data;
};

/**
 * Provides information about drivers for each session.
 * @param params query parameters
 * @returns data
 */
export const fetchDrivers = async (params: DriverParams) => {
  const endpoint = "/drivers";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Fetches real-time interval data between drivers and their gap to the race leader.
 * Available during races only, with updates approximately every 4 seconds.
 * @param params query parameters
 * @returns data
 */
export const fetchIntervals = async (params: IntervalParams) => {
  const endpoint = "/intervals";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides detailed information about individual laps.
 * @param params query parameters
 * @returns data
 */
export const fetchLaps = async (params: LapParams) => {
  const endpoint = "/laps";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * The approximate location of the cars on the circuit, at a sample rate of about 3.7 Hz.
 * Useful for gauging their progress along the track, but lacks details about lateral placement
 * — i.e. whether the car is on the left or right side of the track. The origin point (0, 0, 0)
 * appears to be arbitrary and not tied to any specific location on the track.
 * @param params query parameters
 * @returns data
 */
export const fetchLocation = async (params: LocationParams, dateRangeParams?: DateRangeParams) => {
  const endpoint = "/location";
  const data = await fetchApiData(endpoint, params, dateRangeParams);
  return data;
};

/**
 * Provides information about meetings.
 *
 * A meeting refers to a Grand Prix or testing weekend and
 * usually includes multiple sessions (practice, qualifying, race, ...).
 * @param params query parameters
 * @returns data
 */
export const fetchMeeting = async (params?: MeetingParams) => {
  const endpoint = "/meetings";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides information about cars going through the pit lane.
 * @param params query parameters
 * @returns data
 */
export const fetchPit = async (params: PitParams) => {
  const endpoint = "/pit";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides driver positions throughout a session, including
 * initial placement and subsequent changes.
 * @param params query parameters
 * @returns data
 */
export const fetchPosition = async (params: PositionParams) => {
  const endpoint = "/position";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides information about race control (racing incidents, flags, safety car, ...).
 * @param params query parameters
 * @returns data
 */
export const fetchRaceControl = async (params: RaceControlParams) => {
  const endpoint = "/race_control";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides information about sessions.
 * A session refers to a distinct period of track activity during a
 * Grand Prix or testing weekend (practice, qualifying, sprint, race, ...).
 * @param params query parameters
 * @returns data
 */
export const fetchSession = async (params: SessionParams) => {
  const endpoint = "/sessions";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides information about individual stints.
 * A stint refers to a period of continuous driving by a driver
 * during a session.
 * @param params query parameters
 * @returns data
 */
export const fetchStint = async (params: StintParams) => {
  const endpoint = "/stints";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * Provides a collection of radio exchanges between Formula 1 drivers
 * and their respective teams during sessions. Please note that only
 * a limited selection of communications are included, not the complete record
 * of radio interactions.
 * @param params query parameters
 * @returns data
 */
export const fetchTeamRadio = async (params: TeamRadioParams) => {
  const endpoint = "/team_radio";
  const data = await fetchApiData(endpoint, params);
  return data;
};

/**
 * The weather over the track, updated every minute.
 * @param params query parameters
 * @returns data
 */
export const fetchWeather = async (params: WeatherParams,
  dateRangeParams?: DateRangeParams) => {
  const endpoint = "/weather";
  const data = await fetchApiData(endpoint, params, dateRangeParams);
  return data;
};
