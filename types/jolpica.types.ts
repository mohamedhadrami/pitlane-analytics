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
    Location: JLPLocation;
};

export type JLPSession = {
    date: string;
    time: string;
};

export type JLPRace = JLPBaseRace & {
    FirstPractice?: JLPSession;
    SecondPractice?: JLPSession;
    ThirdPractice?: JLPSession;
    Qualifying?: JLPSession;
    SprintQualifying?: JLPSession;
    Sprint?: JLPSession;
};

export type JLPTime = {
    millis: string;
    time: string;
}

export type JLPTimeValue = {
    time: string;
};

export type JLPFastestTime = {
    rank: string;
    lap: string;
    Time: JLPTimeValue;
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

export type JLPBaseStandings = {
    season: string;
    round: string;
};

export type JLPBaseRace = {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: JLPCircuit;
    date: string;
    time: string;
};

export type JLPBaseRaceTable = {
    season: string;
    Races: JLPBaseRace[];
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

export type JLPDriverStandingsList = JLPBaseStandings & {
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

export type JLPConstructorStandingsList = JLPBaseStandings & {
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
    MRData: JLPMRData<JLPBaseRaceTable, "RaceTable">;
};

// --- Results ---

export type JLPRaceResultsResponse = {
    MRData: JLPMRData<JLPRaceResultsTable, "RaceTable">;
};

export type JLPRaceResultsTable = {
    season: string;
    Races: JLPRaceResults[];
};
export type JLPRaceResults = JLPBaseRace & {
    Results: JLPResult[];
};

export type JLPResult = {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: JLPDriver;
    Constructor: JLPConstructor;
    grid: string;
    laps: string;
    status: string;
    Time: JLPTime;
    FastestLap: JLPFastestTime;
}


// --- Results by Circuit ---

export type JLPRaceResultsByCircuitResponse = {
    MRData: JLPMRData<JLPRaceResultsByCircuitTable, "RaceTable">;
};

export type JLPRaceResultsByCircuitTable = JLPRaceResultsTable & {
    circuitId: string;
};

// --- Results by Driver ---

export type JLPRaceResultsByDriverResponse = {
    MRData: JLPMRData<JLPRaceResultsByDriverTable, "RaceTable">;
};

export type JLPRaceResultsByDriverTable = JLPRaceResultsTable & {
    driverId: string;
};

// --- Results by Constructor ---

export type JLPRaceResultsByConstructorResponse = {
    MRData: JLPMRData<JLPRaceResultsByConstructorTable, "RaceTable">;
};

export type JLPRaceResultsByConstructorTable = JLPRaceResultsTable & {
    constructorId: string;
};




// --- Driver Details ---

export type JLPDriverDetailsResponse = {
    MRData: JLPMRData<JLPDriverDetailsTable, "DriverTable">;
}

export type JLPDriverDetailsTable = {
    driverId: string;
    Drivers: JLPDriver[]
}

// --- Constructor Details ---

export type JLPConstructorDetailsResponse = {
    MRData: JLPMRData<JLPConstructorDetailsTable, "ConstructorTable">;
}

export type JLPConstructorDetailsTable = {
    driverId: string;
    Constructors: JLPConstructor[]
}
