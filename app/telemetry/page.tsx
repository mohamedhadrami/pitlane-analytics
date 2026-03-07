// @/app/telemetry/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Divider } from "@nextui-org/react";

import { useFooter } from "@/context/FooterContext";
import { TelemetryProvider, useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { useFetchMeetings, useFetchSessionData, useFetchSessions, useFetchTelemetryData, useFetchYears, useHandleDriverSelect } from "@/hooks/Telemetry/useTelemetryData";

import TelemetryStepManager from "@/components/Telemetry/TelemetryStepManager";
import Header from "@/components/Telemetry/Header";
import { TelemetryUIProvider } from "@/context/Telemetry/TelemetryUIContext";
import { LapTimeChartProvider } from "@/context/Telemetry/LapTimeChartContext";

const PageContent: React.FC = () => {
    const { setFooterVisible } = useFooter();
    const {
        setSelectedYear,
        setSelectedMeetingKey,
        setSelectedSessionKey,
    } = useTelemetry();

    const searchParams = useSearchParams();
    const [paramsProcessed, setParamsProcessed] = useState(false); // Flag to indicate when query params are processed

    useEffect(() => {
        setFooterVisible(false);

        return () => {
            setFooterVisible(true);
        };
    }, [setFooterVisible]);

    useEffect(() => {
        if (searchParams) {
            const queryYear = searchParams.get("year");
            const queryMeeting = searchParams.get("meeting");
            const querySession = searchParams.get("session");

            if (queryYear) setSelectedYear(queryYear);
            if (queryMeeting) setSelectedMeetingKey(parseInt(queryMeeting));
            if (querySession) setSelectedSessionKey(parseInt(querySession));

            // Set the flag to true after processing the parameters
            setParamsProcessed(true);
        }
    }, [searchParams, setSelectedYear, setSelectedMeetingKey, setSelectedSessionKey]);

    useFetchYears(paramsProcessed);
    useFetchMeetings(paramsProcessed);
    useFetchSessions(paramsProcessed);
    useFetchSessionData();
    useHandleDriverSelect();
    useFetchTelemetryData();

    return (
        <div className="min-h-screen max-h-screen flex flex-col">
            <Header />
            <Divider />
            <TelemetryStepManager />
        </div>
    );
};


const Page: React.FC = () => {
    return (
        <TelemetryProvider>
            <TelemetryUIProvider>
                <LapTimeChartProvider>
                    <PageContent />
                </LapTimeChartProvider>
            </TelemetryUIProvider>
        </TelemetryProvider>
    );
};


export default Page;

/*
    const {
        years,
        setYears,
        meetings,
        setMeetings,
        sessions,
        setSessions,
        selectedYear,
        setSelectedYear,
        selectedMeeting,
        setSelectedMeeting,
        selectedMeetingKey,
        setSelectedMeetingKey,
        selectedSession,
        setSelectedSession,
        selectedSessionKey,
        setSelectedSessionKey,
        isShowSession,
        setIsShowSession,
        weather,
        setWeather,
        raceControl,
        setRaceControl,
        circuitData,
        setCircuitData,
        isShowDriverSelect,
        setIsShowDriverSelect,
        drivers,
        setDrivers,
        selectedDrivers,
        setSelectedDrivers,
        isShowPitStrategy,
        setIsShowPitStrategy,
        stints,
        setStints,
        isShowLapTimes,
        setIsShowLapTimes,
        selectedLap,
        setSelectedLap,
        isShowTelemetry,
        setIsShowTelemetry,
    } = useTelemetry();
*/