


export interface DbCircuits {
  circuit_id: number;
  circuit_ref: string;
  name: string;
  location?: string;
  country?: string;
  lat?: number;
  lng?: number;
  alt?: number;
  url: string;
};


export interface DbConstructorResults {
  constructor_results_id: number;
  race_id: number;
  constructor_id: number;
  points?: number;
  status?: string;
};



export interface DbConstructorStandings {
  constructor_standings_id: number;
  raceId: number;
  constructorId: number;
  points: number;
  position?: number;
  positionText?: number;
  wins: number;
};



export interface DbConstructors {
  constructor_id: number;
  constructor_ref: string;
  name: string;
  nationality?: string;
  url: string;
};



export interface DbDriverStandings {
  driver_standings_id: number;
  race_id: number;
  driver_id: number;
  points: number;
  position?: number;
  position_text?: string;
  wins: number;
};


export interface DbDrivers {
  driver_id: number;
  driver_ref: string;
  number?: number;
  code?: string;
  forename: string;
  surname: string;
  dob?: string;
  nationality?: string;
  url: string;
};



export interface DbLapTimes {
  race_id: number;
  driver_id: number;
  lap: number;
  position?: number;
  time?: string;
  milliseconds?: number;
};



export interface DbPitStops {
  race_id: number;
  driver_id: number;
  stop: number;
  lap: number;
  time: number;
  duration?: string;
  milliseconds?: number;
};



export interface DbQualifying {
  qualify_id: number;
  race_id: number;
  driver_id: number;
  constructor_id: number;
  number: number;
  position?: number;
  q1?: string;
  q2?: string;
  q3?: string;
};


export interface DbRaces {
  race_id: number;
  year: number;
  round: number;
  circuit_id: number;
  name: string;
  date?: string;
  time?: string;
  url?: string;
  fp1_date?: string;
  fp1_time?: string;
  fp2_date?: string;
  fp2_time?: string;
  fp3_date?: string;
  fp3_time?: string;
  quali_date?: string;
  quali_time?: string;
  sprint_date?: string;
  sprint_time?: string;
};

export const RacesKeys: string[] = [
  "race_id",
  "year",
  "round",
  "circuit_id",
  "name",
  "date",
  "time",
  "url",
  "fp1_date",
  "fp1_time",
  "fp2_date",
  "fp2_time",
  "fp3_date",
  "fp3_time",
  "quali_date",
  "quali_time",
  "sprint_date",
  "sprint_time"
];


/**
 * @param result_id
 * @param race_id
 * @param driver_id
 * @param constructor_id
 * @param number
 * @param grid
 * @param position
 * @param position_text
 * @param position_order
 * @param points
 * @param laps
 * @param time
 * @param milliseconds
 * @param fastest_lap
 * @param rank
 * @param fastest_lap_time
 * @param fastest_lap_speed
 * @param status_id
 */
export interface DbResults {
  result_id: number;
  race_id: number;
  driver_id: number;
  constructor_id: number;
  number?: number;
  grid: number;
  position?: number;
  position_text: string;
  position_order: number;
  points: number;
  laps: number;
  time?: string;
  milliseconds?: number;
  fastest_lap?: number;
  rank?: number;
  fastest_lap_time?: string;
  fastest_lap_speed?: string;
  status_id: number;
}

export const ResultsKeys: string[] = [
  "result_id",
  "race_id",
  "driver_id",
  "constructor_id",
  "number",
  "grid",
  "position",
  "position_text",
  "position_order",
  "points",
  "laps",
  "time",
  "milliseconds",
  "fastest_lap",
  "rank",
  "fastest_lap_time",
  "fastest_lap_speed",
  "status_id"
];

export interface DbSeasons {
  year: number;
  url: string;
};


export interface DbSprintResults {
  sprintResult_id: number;
  race_id: number;
  driver_id: number;
  constructor_id: number;
  number: number;
  grid: number;
  position?: number;
  position_text: string;
  position_order: number;
  points: number;
  laps: number;
  time: string;
  milliseconds?: number;
  fastest_lap?: number;
  fastest_lap_time?: string;
  status_id: number;
};


/**
 * @param status_id
 * @param status
 */
export interface DbStatus {
  status_id: number;
  status: string;
};

export const StatusKeys = [
  "status_id",
  "status"
]