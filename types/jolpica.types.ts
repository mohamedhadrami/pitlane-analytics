// --- Base Models ---

export type JLPDriver = {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
};

export type JLPConstructor = {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
};

export type JLPLocation = {
    lat: string;
    long: string;
    locality: string;
    country: string;
};

export type JLPCircuit = {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: Location;
};

export type JLPSession = {
    date: string;
    time: string;
};

// --- Shared Structures ---

export type JLPMRData<T, K extends string = "StandingsTable"> = {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
} & {
    [key in K]: T;
};


export type JLPStandingsListBase = {
    season: string;
    round: string;
};

// --- Driver Standings ---

export type JLPDriverStandingsResponse = {
    MRData: JLPMRData<JLPDriverStandingsTable, "StandingsTable">;
};

export type JLPDriverStandingsTable = {
    season: string;
    round: string;
    StandingsLists: JLPDriverStandingsList[];
};

export type JLPDriverStandingsList = JLPStandingsListBase & {
    DriverStandings: JLPDriverStandingItem[];
};

export type JLPDriverStandingItem = {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Driver: JLPDriver;
    Constructors: JLPConstructor[];
};

// --- Constructor Standings ---

export type JLPConstructorStandingsResponse = {
    MRData: JLPMRData<JLPConstructorStandingsTable, "StandingsTable">;
};

export type JLPConstructorStandingsTable = {
    season: string;
    round: string;
    StandingsLists: JLPConstructorStandingsList[];
};

export type JLPConstructorStandingsList = JLPStandingsListBase & {
    ConstructorStandings: JLPConstructorStandingItem[];
};

export type JLPConstructorStandingItem = {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: JLPConstructor;
};


// --- Schedule ---

export type JLPScheduleResponse = {
    MRData: JLPMRData<JLPRaceTable, "RaceTable">;
};

export type JLPRaceTable = {
    season: string;
    Races: JLPRace[];
};

export type JLPRace = {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: JLPCircuit;
    date: string;
    time: string;
    FirstPractice?: JLPSession;
    SecondPractice?: JLPSession;
    ThirdPractice?: JLPSession;
    Qualifying?: JLPSession;
    SprintQualifying?: JLPSession;
    Sprint?: JLPSession;
};