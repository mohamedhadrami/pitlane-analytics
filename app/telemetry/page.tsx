// @/app/telemetry/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";

import { useFooter } from "@/context/FooterContext";
import { TelemetryProvider, useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { useFetchMeetings } from "@/hooks/Telemetry/useFetchMeetings";
import { useFetchSessionData } from "@/hooks/Telemetry/useFetchSessionData";
import { useFetchSessions } from "@/hooks/Telemetry/useFetchSessions";
import { useFetchTelemetryData } from "@/hooks/Telemetry/useFetchTelemetryData";
import { useFetchYears } from "@/hooks/Telemetry/useFetchYears";
import { useHandleDriverSelect } from "@/hooks/Telemetry/useHandleDriverSelect";

import TelemetryStepManager from "@/components/Telemetry/TelemetryStepManager";
import Header from "@/components/Telemetry/Header";
import { TelemetryUIProvider } from "@/context/Telemetry/TelemetryUIContext";
import { Button } from "@/components/ui/button";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const PageContent: React.FC = () => {
    const { setFooterVisible } = useFooter();

    useEffect(() => {
        setFooterVisible(false);

        return () => {
            setFooterVisible(true);
        };
    }, [setFooterVisible]);

    const {
        goToNextStep,
        goToPreviousStep,
        isFirstStep,
        isLastStep,
        selectedMeeting,
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
            if (queryMeeting) setSelectedMeetingKey(Number.parseInt(queryMeeting));
            if (querySession) setSelectedSessionKey(Number.parseInt(querySession));
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