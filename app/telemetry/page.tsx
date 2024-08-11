// @/app/telemetry/page.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Info, RotateCcw } from "lucide-react";

import { useFooter } from "@/context/FooterContext";
import { TelemetryProvider, useTelemetry } from "@/context/TelemetryContext";
import { useFetchMeetings, useFetchSessionData, useFetchSessions, useFetchTelemetryData, useFetchYears, useHandleDriverSelect } from "@/hooks/Telemetry/useTelemetryData";

import TelemetryStepManager from "@/components/Telemetry/TelemetryStepManager";
import TelemetryBreadcrumbs from "@/components/Telemetry/TelemetryBreadcrumbs";

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

        selectedMeeting
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
            <motion.div
                key="breadcrumb"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-row items-center p-1"
            >
                <div className="">
                    <TelemetryBreadcrumbs />
                </div>
                <div className="ml-auto flex flex-row gap-3 items-center">
                    {selectedMeeting && (
                        <div className="flex flex-row items-center gap-3 text-sm font-extralight">
                            {selectedMeeting.meeting_official_name}
                            <Info />
                        </div>
                    )}
                    <RotateCcw onClick={() => setSelectedYear(undefined)} />
                </div>
            </motion.div>
            <Divider />
            <TelemetryStepManager />
        </div>
    );
};


const Page: React.FC = () => {
    return (
        <TelemetryProvider>
            <PageContent />
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