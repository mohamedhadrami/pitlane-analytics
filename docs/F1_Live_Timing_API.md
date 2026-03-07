# F1 Live Timing API

```javascript
BASE_URL = 'https://livetiming.formula1.com/static'
```

## Getting Started

### GET /${year} - _RACE by YEAR_

**Schema**

```json
{
    "Year": number,
    "Meetings": [
        {
            "Sessions": [
                {
                    "Key": number,
                    "Type": string,
                    "Number": number,
                    "Name": string,
                    "StartDate": string,
                    "EndDate": string,
                    "GmtOffset": string,
                    "Path": string
                },
                {}, {}, ... , {}
            ],
            "Key": number,
            "Code": string,
            "Number": number,
            "Location": string,
            "OfficialName": string,
            "Name": string,
            "Country": {
            "Key": number,
            "Code": string,
            "Name": string
            },
            "Circuit": {
            "Key": number,
            "ShortName": string
            }
        }
    ]
}
```

Using PATH, you can access more about a particular session.

### GET /${path}/Index.json - Accesible Session Feeds

```json
{
  "Feeds": {
    "SessionInfo": {
      "KeyFramePath": "SessionInfo.json",
      "StreamPath": "SessionInfo.jsonStream"
    },
    "ArchiveStatus": {
      "KeyFramePath": "ArchiveStatus.json",
      "StreamPath": "ArchiveStatus.jsonStream"
    },
    "TrackStatus": {
      "KeyFramePath": "TrackStatus.json",
      "StreamPath": "TrackStatus.jsonStream"
    },
    "SessionData": {
      "KeyFramePath": "SessionData.json",
      "StreamPath": "SessionData.jsonStream"
    },
    "ContentStreams": {
      "KeyFramePath": "ContentStreams.json",
      "StreamPath": "ContentStreams.jsonStream"
    },
    "ChampionshipPrediction": {
      "KeyFramePath": "ChampionshipPrediction.json",
      "StreamPath": "ChampionshipPrediction.jsonStream"
    },
    "AudioStreams": {
      "KeyFramePath": "AudioStreams.json",
      "StreamPath": "AudioStreams.jsonStream"
    },
    "DriverList": {
      "KeyFramePath": "DriverList.json",
      "StreamPath": "DriverList.jsonStream"
    },
    "TimingDataF1": {
      "KeyFramePath": "TimingDataF1.json",
      "StreamPath": "TimingDataF1.jsonStream"
    },
    "TopThree": {
      "KeyFramePath": "TopThree.json",
      "StreamPath": "TopThree.jsonStream"
    },
    "TimingData": {
      "KeyFramePath": "TimingData.json",
      "StreamPath": "TimingData.jsonStream"
    },
    "LapSeries": {
      "KeyFramePath": "LapSeries.json",
      "StreamPath": "LapSeries.jsonStream"
    },
    "TimingAppData": {
      "KeyFramePath": "TimingAppData.json",
      "StreamPath": "TimingAppData.jsonStream"
    },
    "TimingStats": {
      "KeyFramePath": "TimingStats.json",
      "StreamPath": "TimingStats.jsonStream"
    },
    "ExtrapolatedClock": {
      "KeyFramePath": "ExtrapolatedClock.json",
      "StreamPath": "ExtrapolatedClock.jsonStream"
    },
    "Position.z": {
      "KeyFramePath": "Position.z.json",
      "StreamPath": "Position.z.jsonStream"
    },
    "CarData.z": {
      "KeyFramePath": "CarData.z.json",
      "StreamPath": "CarData.z.jsonStream"
    },
    "TyreStintSeries": {
      "KeyFramePath": "TyreStintSeries.json",
      "StreamPath": "TyreStintSeries.jsonStream"
    },
    "LapCount": {
      "KeyFramePath": "LapCount.json",
      "StreamPath": "LapCount.jsonStream"
    },
    "DriverRaceInfo": {
      "KeyFramePath": "DriverRaceInfo.json",
      "StreamPath": "DriverRaceInfo.jsonStream"
    },
    "SessionStatus": {
      "KeyFramePath": "SessionStatus.json",
      "StreamPath": "SessionStatus.jsonStream"
    },
    "Heartbeat": {
      "KeyFramePath": "Heartbeat.json",
      "StreamPath": "Heartbeat.jsonStream"
    },
    "WeatherData": {
      "KeyFramePath": "WeatherData.json",
      "StreamPath": "WeatherData.jsonStream"
    },
    "WeatherDataSeries": {
      "KeyFramePath": "WeatherDataSeries.json",
      "StreamPath": "WeatherDataSeries.jsonStream"
    },
    "TeamRadio": {
      "KeyFramePath": "TeamRadio.json",
      "StreamPath": "TeamRadio.jsonStream"
    },
    "TlaRcm": {
      "KeyFramePath": "TlaRcm.json",
      "StreamPath": "TlaRcm.jsonStream"
    },
    "RaceControlMessages": {
      "KeyFramePath": "RaceControlMessages.json",
      "StreamPath": "RaceControlMessages.jsonStream"
    },
    "CurrentTyres": {
      "KeyFramePath": "CurrentTyres.json",
      "StreamPath": "CurrentTyres.jsonStream"
    },
    "PitLaneTimeCollection": {
      "KeyFramePath": "PitLaneTimeCollection.json",
      "StreamPath": "PitLaneTimeCollection.jsonStream"
    }
  }
}
```

- SessionInfo
- ArchiveStatus
- TrackStatus
- SessionData
- ContentStreams
- ChampionshipPrediction
- AudioStreams
- DriverList
- TimingDataF1
- TopThree
- TimingData
- LapSeries
- TimingAppData
- TimingStats
- ExtrapolatedClock
- Positionz
- CarDataz
- TyreStintSeries
- LapCount
- DriverRaceInfo
- SessionStatus
- Heartbeat
- WeatherData
- WeatherDataSeries
- TeamRadio
- TlaRcm
- RaceControlMessages
- CurrentTyres
- PitLaneTimeCollection

## Key Endpoints

### SessionInfo

### ArchiveStatus

### TrackStatus

### SessionData

### ContentStreams

### ChampionshipPrediction

### AudioStreams

### DriverList

### TimingDataF1

### TopThree

### TimingData

### LapSeries

### TimingAppData

### TimingStats

### ExtrapolatedClock

Tells you time remaining in a session

### Positionz

### CarDataz

### TyreStintSeries

### LapCount

Gives current lap and total laps

### DriverRaceInfo

### SessionStatus

### Heartbeat

Heartbeat sent out during a session

### WeatherData

### WeatherDataSeries

### TeamRadio

### TlaRcm

### RaceControlMessages

### CurrentTyres

### PitLaneTimeCollection
