
export type LiveTimingSignalRSubs = {
    SessionInfo: LiveSessionInfo;
    ArchiveStatus: LiveArchiveStatus;
    TrackStatus: LiveTrackStatus;
    SessionData: LiveSessionData;
    ContentStreams: LiveContentStreams;
    ChampionshipPrediction: LiveChampionshipPrediction;
    AudioStreams: LiveAudioStreams;
    DriverList: LiveDriverList;
    TimingDataF1: LiveTimingDataF1;
    TopThree: LiveTopThree;
    TimingData: LiveTimingData;
    LapSeries: LiveLapSeries;
    TimingAppData: LiveTimingAppData;
    TimingStats: LiveTimingStats;
    ExtrapolatedClock: LiveExtrapolatedClock;
    PositionZ: LivePositionZ;
    CarDataZ: LiveCarDataZ;
    TyreStintSeries: LiveTyreStintSeries;
    LapCount: LiveLapCount;
    DriverRaceInfo: LiveDriverRaceInfo;
    SessionStatus: LiveSessionStatus;
    Heartbeat: LiveHeartbeat;
    WeatherData: LiveWeatherData;
    WeatherDataSeries: LiveWeatherDataSeries;
    TeamRadio: LiveTeamRadio;
    TlaRcm: LiveTlaRcm;
    RaceControlMessages: LiveRaceControlMessages;
    CurrentTyres: LiveCurrentTyres;
    PitLaneTimeCollection: LivePitLaneTimeCollection;
    CarData: LiveCarData;
    Position: LivePosition;
}





// SessionInfo.json
export type LiveSessionInfo = {
    Meeting: LiveMeetingInfo;
    ArchiveStatus: LiveArchiveStatus;
    Key: number,
    Type: string,
    Name: string,
    StartDate: string,
    EndDate: string,
    GmtOffset: string,
    Path: string
}

type LiveMeetingInfo = {
    Key: number,
    Name: string,
    OfficialName: string,
    Location: string,
    Country: {
        Key: number,
        Code: string,
        Name: string
    },
    Circuit: {
        Key: number,
        ShortName: string
    }
}




//  ArchiveStatus.json
export type LiveArchiveStatus = {
    Status: string;
    _kf: boolean;
}




//  TrackStatus.json
export type LiveTrackStatus = {
    Status: string;
    Message: string;
    _kf: boolean;
}




// SessionData.json
export type LiveSessionData = {
    Series: LiveSessionDataSeries[];
    StatusSeries: LiveSessionDataStatusSeries[];
}

export type LiveSessionDataSeries = {
    Utc: string;
    Lap: number;
};

export type LiveSessionDataStatusSeries = {
    Utc: string;
    TrackStatus: string;
};


// ContentStreams.json
export type LiveContentStreams = {
    Stream: LiveStreamObject[]
}

type LiveStreamObject = {
    Type: string;
    Name: string;
    Language: string;
    Uri: string;
    Path?: string;
    Utc: string;
}



// AudioStreams.json
export type LiveAudioStreams = {
    Stream: LiveStreamObject[]
}




// ChampionshipPrediction.json
export type LiveChampionshipPrediction = {

}




// ExtrapolatedClock.json
export type LiveExtrapolatedClock = {
    Utc: string;
    Remaining: string;
    Extrapolating: boolean;
}




// DriverList.json
export type LiveDriverList = {
    [key: string]: LiveDriver;
}

export type LiveDriver = {
    RacingNumber: string;
    BroadcastName: string;
    FullName: string;
    Tla: string;
    Line: number;
    TeamName: string;
    TeamColour: string;
    FirstName: string;
    LastName: string;
    Reference: string;
    HeadshotUrl: string;
    CountryCode: string;
}




// TimingDataF1.json
export type LiveTimingDataF1 = {
    NoEntries?: number[];
    SessionPart?: number;
    CutOffTime?: string;
    CutOffPercentage?: string;
    Lines: {
        [driverNumber: string]: LiveTimingDataF1LineData;
    }
    Withheld: boolean;
}

export type LiveTimingDataF1LineData = {
    Stats?: { timeDiffToFastest: string; timeDifftoPositionAhead: string }[];
	TimeDiffToFastest?: string;
	TimeDiffToPositionAhead?: string;
	GapToLeader: string;
	IntervalToPositionAhead?: {
		Value: string;
		Catching: boolean;
	};
    Line: number;
    Position: string;
    ShowPosition: boolean;
    RacingNumber: string;
    Retired: boolean;
    InPit: boolean;
    PitOut: boolean;
    Stopped: boolean;
    Status: number;
    Sectors: LiveTimingDataF1LineDataSectors[];
    Speeds: LiveTimingDataF1LineDataSpeeds;
    BestLapTime: LiveTimingDataF1LineDataBestLapTime;
    LastLapTime: LiveTimingDataF1LineDataLastLapTime;
    NumberOfLaps: number;
    NumberOfPitStops?: number;
    KnockedOut?: boolean;
	Cutoff?: boolean;
}

export type LiveTimingDataF1LineDataSectors = {
    Stopped: boolean;
    Value: string;
    Status: number;
    OverallFastest: boolean;
    PersonalFastest: boolean;
    Segments: LiveTimingDataF1LineDataSectorsSegment[];
    PreviousValue?: string
}

export type LiveTimingDataF1LineDataSectorsSegment = {
    Status: number;
}

export type LiveTimingDataF1LineDataSpeeds = {
    I1: LiveTimingDataF1LineDataSpeedsData;
    I2: LiveTimingDataF1LineDataSpeedsData;
    FL: LiveTimingDataF1LineDataSpeedsData;
    ST: LiveTimingDataF1LineDataSpeedsData;
}

export type LiveTimingDataF1LineDataSpeedsData = {
    Value: string;
    Status: number;
    OverallFastest: boolean;
    PersonalFastest: boolean;
}

export type LiveTimingDataF1LineDataBestLapTime = {
    Value: string;
    Lap: number;
}

export type LiveTimingDataF1LineDataLastLapTime = LiveTimingDataF1LineDataSpeedsData;




// TopThree.json
export type LiveTopThree = {
    Withheld: boolean;
    Lines: LiveTopThreeDriver[];
}

export type LiveTopThreeDriver = {
    position: string;
    showPosition: boolean;
    racingNumber: string;
    tla: string;
    broadcastName: string;
    fullName: string;
    team: string;
    teamColour: string;
    lapTime: string;
    lapState: number;
    diffToAhead: string;
    diffToLeader: string;
    overallFastest: boolean;
    personalFastest: boolean;
};




// TimingData.json
export type LiveTimingData = LiveTimingDataF1;




// LapSeries.json
export type LiveLapSeries = {
    [driverNumber: string]: LiveLapSeriesDriver;
}

export type LiveLapSeriesDriver = {
    RacingNumber: string;
    LapPosition: string[];
}




// TimingAppData.json
export type LiveTimingAppData = {
    Lines: {
        [driverNumber: string]: LiveTimingAppDataLineData;
    };
}

export type LiveTimingAppDataLineData = {
    RacingNumber: string;
    Line: number;
    Stints: LiveTimingAppDataLineDataStint[];
}

export type LiveTimingAppDataLineDataStint = {
    LapFlags: number,
    Compound: string,
    New: string,
    TyresNotChanged: string,
    TotalLaps: number,
    StartLaps: number,
    LapTime: string,
    LapNumber: number
}




// TimingStats.json
export type LiveTimingStats = {
    Withheld: boolean;
    Lines: {
        [key: string]: LiveTimingStatsLine;
    };
    SessionType: string;
    _kf: boolean;
}

export type LiveTimingStatsLine = {
    Line: number;
    RacingNumber: string;
    PersonalBestLapTime: LiveTimingStatsData & { Lap: number };
    BestSectors: LiveTimingStatsData[];
    BestSpeeds: {
        I1: LiveTimingStatsData;
        I2: LiveTimingStatsData;
        FL: LiveTimingStatsData;
        ST: LiveTimingStatsData;
    };
}

export type LiveTimingStatsData = {
    Value: string;
    Position: number;
}




// SessionStatus.json
export type LiveSessionStatus = {
    Status: string;
    _kf: boolean;
}




// TyreStintSeries.json
export type LiveTyreStintSeries = {
    Stints: LiveTyreStintSeriesStints;
}

export type LiveTyreStintSeriesStints = {
    [driverNumber: string]: StintInfo[];
}

export type StintInfo = {
    Compound: string,
    New: string,
    TyresNotChanged: string,
    TotalLaps: number,
    StartLaps: number
}




// WeatherData.json
export type LiveWeatherData = {
    AirTemp: string;
    Humidity: string;
    Pressure: string;
    Rainfall: string;
    TrackTemp: string;
    WindDirection: string;
    WindSpeed: string;
}




// WeatherDataSeries.json
export type LiveWeatherDataSeries = {

}




// Heartbeat.json
export type LiveHeartbeat = {
    Utc: string;
}




// TeamRadio.json
export type LiveTeamRadio = {
    Captures: LiveTeamRadioCapture[];
}

export type LiveTeamRadioCapture = {
    Utc: string,
    RacingNumber: string,
    Path: string
}




// LapCount.json
export interface LiveLapCount {
    CurrentLap: number,
    TotalLaps: number
}




// DriverRaceInfo.json
export type LiveDriverRaceInfo = {
    [driverNumber: string]: LiveDriverRaceInfoData;
}

export type LiveDriverRaceInfoData = {
    RacingNumber: string,
    Position: string,
    Gap: string,
    Interval: string,
    PitStops: number,
    Catching: number,
    OvertakeState: number,
    IsOut: boolean
}




// Position.z.json
export type LivePositionZ = {

}




// CarData.z.json
export type LiveCarDataZ = {

}




// TlaRcm.json
export type LiveTlaRcm = {
    Timestamp: string;
    Message: string;
}




// RaceControlMessages.json
export type LiveRaceControlMessages = {
    Messages: LiveRaceControlMessage[];
}

export type LiveRaceControlMessage = {
	Utc: string;
	Lap: number;
	Message: string;
	Category: "Other" | "Sector" | "Flag" | "Drs" | "SafetyCar" | string;
	Flag?: "BLACK AND WHITE" | "BLUE" | "CLEAR" | "YELLOW" | "GREEN" | "DOUBLE YELLOW" | "RED";
	Scope?: "Driver" | "Track" | "Sector";
	Sector?: number;
	Status?: "ENABLED" | "DISABLED";
    RacingNumber?: string;
};






// CurrentTyres.json
export type LiveCurrentTyres = {
    Tyres: LiveCurrentTyresTyres;
}

type LiveCurrentTyresTyres = {
    [driverNumber: string]: TyreInfo;
}

type TyreInfo = {
    Compound: string;
    New: boolean;
}





// PitLaneTimeCollection.json
export type LivePitLaneTimeCollection = {

}

// CarData.json
export type LiveCarData = {
    Entries: LiveCarDataEntry[];
};

export type LiveCarDataEntry = {
    Utc: string;
    Cars: {
        [driverNumber: string]: {
            Channels: LiveCarDataEntryDataChannels;
        };
    }
};

export type LiveCarDataEntryDataChannels = {
    "0": number; // RPM
    "2": number; // Speed number km/h
    "3": number; // Gear number
    "4": number; // Throttle int 0-100
    "5": number; // Brake int 0-100
    "45": number; // DRS
};



// Position.json

export type LivePosition = {
    Position: LivePositionItem[];
};

export type LivePositionItem = {
    Timestamp: string;
    Entries: {
        [driverNumber: string]: LivePositionItemData;
    }
};

export type LivePositionItemData = {
    Status: string;
    X: number;
    Y: number;
    Z: number;
};

export const objectEntries = <T>(obj: { [key: string]: T }): T[] => {
	return Object.entries(obj).map(([k, v]) => v);
};