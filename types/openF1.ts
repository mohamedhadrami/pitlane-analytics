// intefaces/openF1.ts

export type OpenF1ApiParams = CarDataParams | DateRangeParams | DriverParams | IntervalParams | LapParams | LocationParams | MeetingParams | PitParams | PositionParams | RaceControlParams | SessionParams | StintParams | TeamRadioParams | WeatherParams;

/**
 * @param date_gt 
 * @param date_lt
 */
export interface DateRangeParams {
    date_gt?: string;
    date_lt?: string;
}

/**
 * @param brake	Whether the brake pedal is pressed (100) or not (0).
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param drs	The Drag Reduction System (DRS) status (see mapping table below).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param n_gear	Current gear selection, ranging from 1 to 8. 0 indicates neutral or no gear engaged.
 * @param rpm	Revolutions per minute of the engine.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param speed	Velocity of the car in km/h.
 * @param throttle	Percentage of maximum engine power being used.
 */
export interface CarDataParams {
    brake?: number;
    date?: string;
    driver_number?: number;
    drs?: number;
    meeting_key?: number;
    n_gear?: number;
    rpm?: number;
    session_key?: number;
    speed?: number;
    throttle?: number;
}

export const drsStatus: Record<number, string> = {
    0: 'DRS off',
    1: 'DRS off',
    2: '?',
    3: '?',
    8: 'Detected, eligible once in activation zone',
    9: '?',
    10: 'DRS on',
    12: 'DRS on',
    14: 'DRS activated',
};



/**
 * @param broadcast_name	The driver's name, as displayed on TV.
 * @param country_code	A code that uniquely identifies the country.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param first_name	The driver's first name.
 * @param full_name	The driver's full name.
 * @param headshot_url	URL of the driver's face photo.
 * @param last_name	The driver's last name.
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param name_acronym	Three-letter acronym of the driver's name.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param team_colour	The hexadecimal color value (RRGGBB) of the driver's team.
 * @param team_name	Name of the driver's team.
 */
export interface DriverParams {
    broadcast_name?: string;
    country_code?: string;
    driver_number?: number;
    first_name?: string;
    full_name?: string;
    headshot_url?: string;
    last_name?: string;
    meeting_key?: number | string;
    name_acronym?: string;
    session_key?: number | string;
    team_colour?: string;
    team_name?: string;
}

/**
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param gap_to_leader	The time gap to the race leader in seconds, +1 LAP if lapped, or null for the race leader.
 * @param interval	The time gap to the car ahead in seconds, +1 LAP if lapped, or null for the race leader.
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 */
export interface IntervalParams {
    date?: string;
    driver_number?: number;
    gap_to_leader?: number;
    interval?: number;
    meeting_key?: number | string;
    session_key?: number | string;
}

/**
 * @param date_start	The UTC starting date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param duration_sector_1	The time taken, in seconds, to complete the first sector of the lap.
 * @param duration_sector_2	The time taken, in seconds, to complete the second sector of the lap.
 * @param duration_sector_3	The time taken, in seconds, to complete the third sector of the lap.
 * @param i1_speed	The speed of the car, in km/h, at the first intermediate point on the track.
 * @param i2_speed	The speed of the car, in km/h, at the second intermediate point on the track.
 * @param is_pit_out_lap	A boolean value indicating whether the lap is an "out lap" from the pit (true if it is, false otherwise).
 * @param lap_duration	The total time taken, in seconds, to complete the entire lap.
 * @param lap_number	The sequential number of the lap within the session (starts at 1).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param segments_sector_1	A list of values representing the "mini-sectors" within the first sector (see mapping table below).
 * @param segments_sector_2	A list of values representing the "mini-sectors" within the second sector (see mapping table below).
 * @param segments_sector_3	A list of values representing the "mini-sectors" within the third sector (see mapping table below).
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param st_speed	The speed of the car, in km/h, at the speed trap, which is a specific point on the track where the highest speeds are usually recorded.
 */
export interface LapParams {
    date_start?: string;
    driver_number?: number;
    duration_sector_1?: number;
    duration_sector_2?: number;
    duration_sector_3?: number;
    i1_speed?: number;
    i2_speed?: number;
    is_pit_out_lap?: boolean;
    lap_duration?: number;
    lap_number?: number;
    meeting_key?: number | string;
    segments_sector_1?: [];
    segments_sector_2?: [];
    segments_sector_3?: [];
    session_key?: number | string;
    st_speed?: number;
}

export const segmentColor: Record<number, string> = {
    0: '#52525B',
    2048: '#FFFF00', // No improvement on PB (Yellow)
    2049: '#00FF00', // PB (Green)
    2050: 'white', // Unknown
    2051: '#FF00FF', // Best (Purple)
    2052: 'white', // Unknown
    2064: '#0000FF', // Enter/ exit boxes (Blue)
    2068: 'white' // Unknown
};



/**
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param x	The 'x' value in a 3D Cartesian coordinate system representing the current approximate location of the car on the track.
 * @param y	The 'y' value in a 3D Cartesian coordinate system representing the current approximate location of the car on the track.
 * @param z	The 'z' value in a 3D Cartesian coordinate system representing the current approximate location of the car on the track.
 */
export interface LocationParams {
    date?: string;
    driver_number?: number;
    meeting_key?: number | string;
    session_key?: number | string;
    x?: number;
    y?: number;
    z?: number;
}

/**
 * @param circuit_key The unique identifier for the circuit where the event takes place.
 * @param circuit_short_name The short or common name of the circuit where the event takes place.
 * @param country_code A code that uniquely identifies the country.
 * @param country_key The unique identifier for the country where the event takes place.
 * @param country_name The full name of the country where the event takes place.
 * @param date_start The UTC starting date and time, in ISO 8601 format.
 * @param gmt_offset The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT).
 * @param location The city or geographical location where the event takes place.
 * @param meeting_key The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param meeting_name The name of the meeting.
 * @param meeting_official_name The official name of the meeting.
 * @param year The year the event takes place.
 */
export interface MeetingParams {
    circuit_key?: number;
    circuit_short_name?: string;
    country_code?: string;
    country_key?: number;
    country_name?: string;
    date_start?: string;
    gmt_offset?: string;
    location?: string;
    meeting_key?: number | string;
    meeting_name?: string;
    meeting_official_name?: string;
    year?: string | number;
}

/**
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param lap_number	The sequential number of the lap within the session (starts at 1).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param pit_duration	The time spent in the pit, from entering to leaving the pit lane, in seconds.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 */
export interface PitParams {
    date?: string;
    driver_number?: number;
    lap_number?: number;
    meeting_key?: number | string;
    pit_duration?: number;
    session_key?: number | string;
}

/**
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param position	Position of the driver (starts at 1).
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 */
export interface PositionParams {
    date?: string;
    driver_number?: number;
    meeting_key?: number | string;
    position?: number;
    session_key?: number | string;
}

/**
 * @param category	The category of the event (CarEvent, Drs, Flag, SafetyCar, ...).
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param flag	Type of flag displayed (GREEN, YELLOW, DOUBLE YELLOW, CHEQUERED, ...).
 * @param lap_number	The sequential number of the lap within the session (starts at 1).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param message	Description of the event or action.
 * @param scope	The scope of the event (Track, Driver, Sector, ...).
 * @param sector	Segment ("mini-sector") of the track where the event occurred? (starts at 1).
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 */
export interface RaceControlParams {
    category?: string;
    date?: string;
    driver_number?: number;
    flag?: string;
    lap_number?: number;
    meeting_key?: number | string;
    message?: string;
    scope?: string;
    sector?: number;
    session_key?: number | string;
}

/**
 * @param circuit_key	The unique identifier for the circuit where the event takes place.
 * @param circuit_short_name	The short or common name of the circuit where the event takes place.
 * @param country_code	A code that uniquely identifies the country.
 * @param country_key	The unique identifier for the country where the event takes place.
 * @param country_name	The full name of the country where the event takes place.
 * @param date_end	The UTC ending date and time, in ISO 8601 format.
 * @param date_start	The UTC starting date and time, in ISO 8601 format.
 * @param gmt_offset	The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT).
 * @param location	The city or geographical location where the event takes place.
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param session_name	The name of the session (Practice 1, Qualifying, Race, ...).
 * @param session_type	The type of the session (Practice, Qualifying, Race, ...).
 * @param year	The year the event takes place.
 */
export interface SessionParams {
    circuit_key?: number;
    circuit_short_name?: string;
    country_code?: string;
    country_key?: number;
    country_name?: string;
    date_end?: string;
    date_start?: string;
    gmt_offset?: string;
    location?: string;
    meeting_key?: number | string;
    session_key?: number | string;
    session_name?: string;
    session_type?: string;
    year?: string | number;
}

/**
 * @param compound	The specific compound of tyre used during the stint (SOFT, MEDIUM, HARD, ...).
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param lap_end	Number of the last completed lap in this stint.
 * @param lap_start	Number of the initial lap in this stint (starts at 1).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param stint_number	The sequential number of the stint within the session (starts at 1).
 * @param tyre_age_at_start	The age of the tyres at the start of the stint, in laps completed.
 */
export interface StintParams {
    compound?: string;
    driver_number?: number;
    lap_end?: number;
    lap_start?: number;
    meeting_key?: number | string;
    session_key?: number | string;
    stint_number?: number;
    tyre_age_at_start?: number;
}

/**
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param driver_number	The unique number assigned to an F1 driver (cf. Wikipedia).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param recording_url	URL of the radio recording.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 */
export interface TeamRadioParams {
    date?: string;
    driver_number?: number;
    meeting_key?: number | string;
    recording_url?: string;
    session_key?: number | string;
}

/**
 * @param air_temperature	Air temperature (°C).
 * @param date	The UTC date and time, in ISO 8601 format.
 * @param humidity	Relative humidity (%).
 * @param meeting_key	The unique identifier for the meeting. Use latest to identify the latest or current meeting.
 * @param pressure	Air pressure (mbar).
 * @param rainfall	Whether there is rainfall.
 * @param session_key	The unique identifier for the session. Use latest to identify the latest or current session.
 * @param track_temperature	Track temperature (°C).
 * @param wind_direction	Wind direction (°), from 0° to 359°.
 * @param wind_speed	Wind speed (m/s).
 */
export interface WeatherParams {
    air_temperature?: number;
    date?: string;
    humidity?: number;
    meeting_key?: number | string;
    pressure?: number;
    rainfall?: number;
    session_key?: number | string;
    track_temperature?: number;
    wind_direction?: number;
    wind_speed?: number;
}