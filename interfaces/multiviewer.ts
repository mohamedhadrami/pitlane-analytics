

export interface trackElement {
    angle: number;
    length: number;
    number: number;
    trackPosition: {
        x: number;
        y: number;
    }
}

export interface candidateLapProps {
    driverNumber: string;
    lapNumber: number;
    lapStartDate: string;
    lapStartSessionTime: number;
    lapTime: number;
    session: string;
    sessionStartTime: number;
}

export interface mvCircuit {
    corners: trackElement[];
    marshalLights: trackElement[];
    marshalSectors: trackElement[];
    candidateLap: candidateLapProps;
    circuitKey: 63;
    circuitName: string;
    countryIocCode: string;
    countryKey: number;
    countryName: string;
    location: string;
    meetingKey: string;
    meetingName: string;
    meetingOfficialName: string;
    miniSectorIndexes: number[];
    raceDate: string;
    rotation: number;
    round: number;
    x: number[];
    y: number[];
    year: number;
} 