
//SessionInfo.json
export type LiveSessionInfo = {

}

// ArchiveStatus.json
export type LiveArchiveStatus = {
    Status: string;
}

// TrackStatus.json
export type LiveTrackStatus = {
    Status: string;
    Message: string;
}

//SessionData.json
export type LiveSessionData = {

}

//ContentStreams.json
export type LiveContentStreams = {
    Stream: LiveStreamObject[]
}

//AudioStreams.json
export type LiveAudioStreams = {
    Stream: LiveStreamObject[]
}

//ChampionshipPrediction.json
export type LiveChampionshipPrediction = {

}

//ExtrapolatedClock.json
export type LiveExtrapolatedClock = {
    Utc: string;
    Remaining: string;
    Extrapolating: boolean;
}

//DriverList.json
export type LiveDriverList = {

}

//TimingDataF1.json
export type LiveTimingDataF1 = {

}

//TopThree.json
export type LiveTopThree = {

}

//TimingData.json
export type LiveTimingData = {

}

//LapSeries.json
export type LiveLapSeries = {

}

//TimingAppData.json
export type LiveTimingAppData = {

}

//TimingStats.json
export type LiveTimingStats = {

}

//SessionStatus.json
export type LiveSessionStatus = {
    Status: string;
}

//TyreStintSeries.json
export type LiveTyreStintSeries = {

}

//WeatherData.json
export type LiveWeatherData = {

}

//WeatherDataSeries.json
export type LiveWeatherDataSeries = {

}

//Heartbeat.json
export type LiveHeartbeat = {
    Utc: string;
}

//TeamRadio.json
export type LiveTeamRadio = {

}

// LapCount.json
export interface LiveLapCount {
    CurrentLap: number,
    TotalLaps: number
}

// DriverRaceInfo.json
export type LiveDriverRaceInfo = {

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

}

// CurrentTyres.json
export type LiveCurrentTyres = {

}

// PitLaneTimeCollection.json
export type LivePitLaneTimeCollection = {

}



// Custom Types


type LiveStreamObject = {
    Type: string;
    Name: string;
    Language: string;
    Uri: string;
    Path?: string;
    Utc: string;
}