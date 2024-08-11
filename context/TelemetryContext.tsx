// @/context/TelemetryContext.tsx
import React, { ReactNode, createContext, useContext, useState } from "react";
import { MeetingParams, SessionParams, WeatherParams, RaceControlParams, DriverParams, StintParams } from "@/interfaces/openF1";
import { DriverChartData } from "@/interfaces/custom";
import { mvCircuit } from "@/interfaces/multiviewer";

interface TelemetryContextProps {
    years: string[];
    setYears: React.Dispatch<React.SetStateAction<string[]>>;
    meetings: MeetingParams[];
    setMeetings: React.Dispatch<React.SetStateAction<MeetingParams[]>>;
    sessions: SessionParams[];
    setSessions: React.Dispatch<React.SetStateAction<SessionParams[]>>;
    selectedYear: string | undefined;
    setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>;
    selectedMeeting: MeetingParams | undefined;
    setSelectedMeeting: React.Dispatch<React.SetStateAction<MeetingParams | undefined>>;
    selectedMeetingKey: number | undefined;
    setSelectedMeetingKey: React.Dispatch<React.SetStateAction<number | undefined>>;
    selectedSession: SessionParams | undefined;
    setSelectedSession: React.Dispatch<React.SetStateAction<SessionParams | undefined>>;
    selectedSessionKey: number | undefined;
    setSelectedSessionKey: React.Dispatch<React.SetStateAction<number | undefined>>;
    isShowSession: boolean;
    setIsShowSession: React.Dispatch<React.SetStateAction<boolean>>;
    weather: WeatherParams[];
    setWeather: React.Dispatch<React.SetStateAction<WeatherParams[]>>;
    raceControl: RaceControlParams[];
    setRaceControl: React.Dispatch<React.SetStateAction<RaceControlParams[]>>;
    circuitData: mvCircuit | undefined;
    setCircuitData: React.Dispatch<React.SetStateAction<mvCircuit | undefined>>;
    isShowDriverSelect: boolean;
    setIsShowDriverSelect: React.Dispatch<React.SetStateAction<boolean>>;
    drivers: DriverParams[];
    setDrivers: React.Dispatch<React.SetStateAction<DriverParams[]>>;
    selectedDrivers: Map<string, DriverChartData>;
    setSelectedDrivers: React.Dispatch<React.SetStateAction<Map<string, DriverChartData>>>;
    isShowPitStrategy: boolean;
    setIsShowPitStrategy: React.Dispatch<React.SetStateAction<boolean>>;
    stints: StintParams[];
    setStints: React.Dispatch<React.SetStateAction<StintParams[]>>;
    isShowLapTimes: boolean;
    setIsShowLapTimes: React.Dispatch<React.SetStateAction<boolean>>;
    selectedLap: number | null;
    setSelectedLap: React.Dispatch<React.SetStateAction<number | null>>;
    isShowTelemetry: boolean;
    setIsShowTelemetry: React.Dispatch<React.SetStateAction<boolean>>;
}

const TelemetryContext = createContext<TelemetryContextProps | undefined>(undefined);

export const useTelemetry = () : TelemetryContextProps => {
    const context = useContext(TelemetryContext);
    if (!context) {
        throw new Error("useTelemetry must be used within a TelemetryProvider");
    }
    return context;
};

export const TelemetryProvider = ({ children }: { children: ReactNode }) => {
    const [years, setYears] = useState<string[]>([]);
    const [meetings, setMeetings] = useState<MeetingParams[]>([]);
    const [sessions, setSessions] = useState<SessionParams[]>([]);

    const [selectedYear, setSelectedYear] = useState<string>();
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingParams>();
    const [selectedMeetingKey, setSelectedMeetingKey] = useState<number>();
    const [selectedSession, setSelectedSession] = useState<SessionParams>();
    const [selectedSessionKey, setSelectedSessionKey] = useState<number>();

    const [isShowSession, setIsShowSession] = useState<boolean>(false);
    const [weather, setWeather] = useState<WeatherParams[]>([]);
    const [raceControl, setRaceControl] = useState<RaceControlParams[]>([]);
    const [circuitData, setCircuitData] = useState<mvCircuit>();

    const [isShowDriverSelect, setIsShowDriverSelect] = useState<boolean>(false);
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<Map<string, DriverChartData>>(new Map());

    const [isShowPitStrategy, setIsShowPitStrategy] = useState<boolean>(false);
    const [stints, setStints] = useState<StintParams[]>([]);

    const [isShowLapTimes, setIsShowLapTimes] = useState<boolean>(false);
    const [selectedLap, setSelectedLap] = useState<number | null>(null);

    const [isShowTelemetry, setIsShowTelemetry] = useState<boolean>(false);

    return (
        <TelemetryContext.Provider value={{
            years, setYears, 
            meetings, setMeetings, 
            sessions, setSessions,
            selectedYear, setSelectedYear, 
            selectedMeeting, setSelectedMeeting, 
            selectedMeetingKey, setSelectedMeetingKey, 
            selectedSession, setSelectedSession,
            selectedSessionKey, setSelectedSessionKey, 
            isShowSession, setIsShowSession,
            weather, setWeather, 
            raceControl, setRaceControl, 
            circuitData, setCircuitData,
            isShowDriverSelect, setIsShowDriverSelect, 
            drivers, setDrivers, 
            selectedDrivers, setSelectedDrivers, 
            isShowPitStrategy, setIsShowPitStrategy,
            stints, setStints, 
            isShowLapTimes, setIsShowLapTimes, 
            selectedLap, setSelectedLap,
            isShowTelemetry, setIsShowTelemetry
        }}>
            {children}
        </TelemetryContext.Provider>
    );
};
