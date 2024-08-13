// @/app/telemetry/page.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Divider } from "@nextui-org/react";

import { useFooter } from "@/context/FooterContext";
import { TelemetryProvider, useTelemetry } from "@/context/TelemetryContext";
import { useFetchMeetings, useFetchSessionData, useFetchSessions, useFetchTelemetryData, useFetchYears, useHandleDriverSelect } from "@/hooks/Telemetry/useTelemetryData";

import TelemetryStepManager from "@/components/Telemetry/TelemetryStepManager";
import Header from "@/components/Telemetry/Header";
import { TelemetryUIProvider } from "@/context/TelemetryUIContext";

const PageContent: React.FC = () => {
    const { setFooterVisible } = useFooter();

    useEffect(() => {
        setFooterVisible(false);

        return () => {
            setFooterVisible(true);
        };
    }, [setFooterVisible]);

    const {
        setSelectedYear,
        setSelectedMeetingKey,
        setSelectedSessionKey,
    } = useTelemetry();

    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams) {
            const queryYear = searchParams.get("year");
            const queryMeeting = searchParams.get("meeting");
            const querySession = searchParams.get("session");
            if (queryYear) setSelectedYear(queryYear);
            if (queryMeeting) setSelectedMeetingKey(parseInt(queryMeeting));
            if (querySession) setSelectedSessionKey(parseInt(querySession));
        }
    }, [searchParams, setSelectedYear, setSelectedMeetingKey, setSelectedSessionKey]);

    useFetchYears();
    useFetchMeetings();
    useFetchSessions();
    useFetchSessionData();
    useHandleDriverSelect();
    useFetchTelemetryData();


    return (
        <div className="min-h-screen flex flex-col">
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
                <PageContent />
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