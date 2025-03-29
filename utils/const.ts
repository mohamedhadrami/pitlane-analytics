// @/utils/consts.ts


export type TableHeaderType = {
    key: string;
    label: string;
}

// TABLE HEADERS

export const DriverChampionshipHeaders: TableHeaderType[] = [
    { key: "position", label: "Position" },
    { key: "acronym", label: "Acronym" },
    { key: "name", label: "Name" },
    { key: "nationality", label: "Nationality" },
    { key: "team", label: "Team" },
    { key: "points", label: "Points" }
]

export const ConstructorChampionshipHeaders: TableHeaderType[] = [
    { key: "position", label: "Position" },
    { key: "name", label: "Name" },
    { key: "nationality", label: "Nationality" },
    { key: "wins", label: "Wins" },
    { key: "points", label: "Points" }
]

export const RaceHeaders: TableHeaderType[] = [
    { key: "position", label: "Position" },
    { key: "driver", label: "Driver" },
    { key: "team", label: "Team" },
    { key: "points", label: "Points" },
    { key: "time", label: "Time" },
    { key: "fastestLap", label: "Fastest Lap" },
    { key: "status", label: "Status" }
]

export const SeasonRacesHeaders: TableHeaderType[] = [
    { key: "race", label: "Race" },
    { key: "first", label: "1st" },
    { key: "second", label: "2nd" },
    { key: "third", label: "3rd" }
]

export const DriverHeader: TableHeaderType[] = [
    { key: "race", label: "Race" },
    { key: "start", label: "Start Position" },
    { key: "final", label: "Final Position" },
    { key: "points", label: "Total Points" },
    { key: "status", label: "Status" }
]

export const ConstructorHeader: TableHeaderType[] = [
    { key: "race", label: "Race" },
    { key: "best", label: "Best Driver" },
    { key: "final", label: "Final Position" },
    { key: "points", label: "Total Points" }
]




export const RetiredStatuses = [
    "Retired",
    "Accident",
    "Gearbox",
    "Engine",
    "Brakes"
]