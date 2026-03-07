// @/context/TelemetryContext.tsx

<<<<<<< HEAD
import React, { ReactNode, createContext, useContext, useState } from "react";
import { MeetingParams, SessionParams, WeatherParams, RaceControlParams, DriverParams, StintParams } from "@/interfaces/openF1";
import { DriverChartData } from "@/interfaces/custom";
import { mvCircuit } from "@/interfaces/multiviewer";
=======
"use client"

import type React from "react";
import { type ReactNode, createContext, useContext, useMemo, useState } from "react"
import type { OFMeeting, OFSession, OFWeather, OFRaceControl, OFDriver, OFStint, OFPosition } from "@/types/openF1.types";
import type { DriverChartData } from "@/types/custom";
import type { mvCircuit } from "@/types/multiviewer";
import { type TelemetryStateShape, TelemetryStep } from "@/utils/telemetry/telemetrySteps";
import useTelemetryStep from "@/hooks/Telemetry/useTelemetryStep";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c

interface TelemetryContextProps {
    years: string[];
    setYears: React.Dispatch<React.SetStateAction<string[]>>;
<<<<<<< HEAD
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
=======
    meetings: OFMeeting[];
    setMeetings: React.Dispatch<React.SetStateAction<OFMeeting[]>>;
    sessions: OFSession[];
    setSessions: React.Dispatch<React.SetStateAction<OFSession[]>>;
    selectedYear: string | undefined;
    setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>;
    selectedMeeting: OFMeeting | undefined;
    setSelectedMeeting: React.Dispatch<React.SetStateAction<OFMeeting | undefined>>;
    selectedMeetingKey: number | undefined;
    setSelectedMeetingKey: React.Dispatch<React.SetStateAction<number | undefined>>;
    selectedSession: OFSession | undefined;
    setSelectedSession: React.Dispatch<React.SetStateAction<OFSession | undefined>>;
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
    selectedSessionKey: number | undefined;
    setSelectedSessionKey: React.Dispatch<React.SetStateAction<number | undefined>>;
    isShowSession: boolean;
    setIsShowSession: React.Dispatch<React.SetStateAction<boolean>>;
<<<<<<< HEAD
    weather: WeatherParams[];
    setWeather: React.Dispatch<React.SetStateAction<WeatherParams[]>>;
    raceControl: RaceControlParams[];
    setRaceControl: React.Dispatch<React.SetStateAction<RaceControlParams[]>>;
=======
    weather: OFWeather[];
    setWeather: React.Dispatch<React.SetStateAction<OFWeather[]>>;
    positions: OFPosition[];
    setPositions: React.Dispatch<React.SetStateAction<OFPosition[]>>;
    raceControl: OFRaceControl[];
    setRaceControl: React.Dispatch<React.SetStateAction<OFRaceControl[]>>;
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
    circuitData: mvCircuit | undefined;
    setCircuitData: React.Dispatch<React.SetStateAction<mvCircuit | undefined>>;
    isShowDriverSelect: boolean;
    setIsShowDriverSelect: React.Dispatch<React.SetStateAction<boolean>>;
<<<<<<< HEAD
    drivers: DriverParams[];
    setDrivers: React.Dispatch<React.SetStateAction<DriverParams[]>>;
=======
    drivers: OFDriver[];
    setDrivers: React.Dispatch<React.SetStateAction<OFDriver[]>>;
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
    selectedDrivers: Map<string, DriverChartData>;
    setSelectedDrivers: React.Dispatch<React.SetStateAction<Map<string, DriverChartData>>>;
    isShowPitStrategy: boolean;
    setIsShowPitStrategy: React.Dispatch<React.SetStateAction<boolean>>;
<<<<<<< HEAD
    stints: StintParams[];
    setStints: React.Dispatch<React.SetStateAction<StintParams[]>>;
    isShowLapTimes: boolean;
    setIsShowLapTimes: React.Dispatch<React.SetStateAction<boolean>>;
    selectedLap: number | null;
    setSelectedLap: React.Dispatch<React.SetStateAction<number | null>>;
    isShowTelemetry: boolean;
    setIsShowTelemetry: React.Dispatch<React.SetStateAction<boolean>>;
=======
    stints: OFStint[];
    setStints: React.Dispatch<React.SetStateAction<OFStint[]>>;
    isShowLapTimes: boolean;
    setIsShowLapTimes: React.Dispatch<React.SetStateAction<boolean>>;
    selectedLap: number | undefined;
    setSelectedLap: React.Dispatch<React.SetStateAction<number | undefined>>;
    isShowTelemetry: boolean;
    setIsShowTelemetry: React.Dispatch<React.SetStateAction<boolean>>;

    currentStep: TelemetryStep;
    setCurrentStep: (step: TelemetryStep) => void;
    maxUnlockedStep: TelemetryStep;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    canGoToStep: (step: TelemetryStep) => boolean;
    stepOrder: TelemetryStep[];
    isFirstStep: boolean;
    isLastStep: boolean;

    resetTelemetry: () => void;
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
}

const TelemetryContext = createContext<TelemetryContextProps | undefined>(undefined);

<<<<<<< HEAD
export const useTelemetry = () : TelemetryContextProps => {
=======
export const useTelemetry = (): TelemetryContextProps => {
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
    const context = useContext(TelemetryContext);
    if (!context) {
        throw new Error("useTelemetry must be used within a TelemetryProvider");
    }
    return context;
};

export const TelemetryProvider = ({ children }: { children: ReactNode }) => {
    const [years, setYears] = useState<string[]>([]);
<<<<<<< HEAD
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
=======
    const [meetings, setMeetings] = useState<OFMeeting[]>([]);
    const [sessions, setSessions] = useState<OFSession[]>([]);

    const [selectedYear, setSelectedYear] = useState<string>();
    const [selectedMeeting, setSelectedMeeting] = useState<OFMeeting>();
    const [selectedMeetingKey, setSelectedMeetingKey] = useState<number>();
    const [selectedSession, setSelectedSession] = useState<OFSession>();
    const [selectedSessionKey, setSelectedSessionKey] = useState<number>();

    const [isShowSession, setIsShowSession] = useState<boolean>(false);
    const [weather, setWeather] = useState<OFWeather[]>([]);
    const [positions, setPositions] = useState<OFPosition[]>([]);
    const [raceControl, setRaceControl] = useState<OFRaceControl[]>([]);
    const [circuitData, setCircuitData] = useState<mvCircuit>();

    const [isShowDriverSelect, setIsShowDriverSelect] = useState<boolean>(false);
    const [drivers, setDrivers] = useState<OFDriver[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<Map<string, DriverChartData>>(new Map());

    const [isShowPitStrategy, setIsShowPitStrategy] = useState<boolean>(false);
    const [stints, setStints] = useState<OFStint[]>([]);

    const [isShowLapTimes, setIsShowLapTimes] = useState<boolean>(false);
    const [selectedLap, setSelectedLap] = useState<number>();

    const [isShowTelemetry, setIsShowTelemetry] = useState<boolean>(false);


    const telemetryStepState = useMemo<TelemetryStateShape>(() => ({
        selectedYear,
        selectedMeetingKey,
        selectedSessionKey,
        selectedDrivers,
        selectedLap,
    }), [
        selectedYear,
        selectedMeetingKey,
        selectedSessionKey,
        selectedDrivers,
        selectedLap,
    ]);

    const {
        currentStep,
        setCurrentStep,
        maxUnlockedStep,
        goToNextStep,
        goToPreviousStep,
        canGoToStep,
        stepOrder,
        isFirstStep,
        isLastStep,
    } = useTelemetryStep(telemetryStepState);


    const resetTelemetry = () => {
        setSelectedYear(undefined);
        setSelectedMeeting(undefined);
        setSelectedMeetingKey(undefined);
        setSelectedSession(undefined);
        setSelectedSessionKey(undefined);
        setSelectedDrivers(new Map());
        setSelectedLap(undefined);
        setIsShowTelemetry(false);
        setIsShowLapTimes(false);
        setCurrentStep(TelemetryStep.Year);
    };

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
            positions, setPositions,
            raceControl, setRaceControl,
            circuitData, setCircuitData,
            isShowDriverSelect, setIsShowDriverSelect,
            drivers, setDrivers,
            selectedDrivers, setSelectedDrivers,
            isShowPitStrategy, setIsShowPitStrategy,
            stints, setStints,
            isShowLapTimes, setIsShowLapTimes,
            selectedLap, setSelectedLap,
            isShowTelemetry, setIsShowTelemetry,

            currentStep, setCurrentStep,
            maxUnlockedStep,
            goToNextStep, goToPreviousStep,
            canGoToStep,
            stepOrder,
            isFirstStep,
            isLastStep,

            resetTelemetry
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
        }}>
            {children}
        </TelemetryContext.Provider>
    );
};
