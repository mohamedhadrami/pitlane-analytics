// @/app/telemetry/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";

import { useFooter } from "@/context/FooterContext";
import { TelemetryProvider, useTelemetry } from "@/context/TelemetryContext";
import { useFetchMeetings } from "@/hooks/Telemetry/useFetchMeetings";
import { useFetchSessionData } from "@/hooks/Telemetry/useFetchSessionData";
import { useFetchSessions } from "@/hooks/Telemetry/useFetchSessions";
import { useFetchTelemetryData } from "@/hooks/Telemetry/useFetchTelemetryData";
import { useFetchYears } from "@/hooks/Telemetry/useFetchYears";
import { useHandleDriverSelect } from "@/hooks/Telemetry/useHandleDriverSelect";

import TelemetryStepManager from "@/components/Telemetry/TelemetryStepManager";
import TelemetryBreadcrumbs from "@/components/Telemetry/TelemetryBreadcrumbs";
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
        resetTelemetry,
        currentStep
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
        <div className="h-screen flex flex-col">
            <motion.div
                key="breadcrumb"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-row items-center p-1 w-full shrink-0"
            >
                <div className="flex flex-row items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`[&_svg]:size-6 ${isFirstStep ? "text-default-200" : ""}`}
                        onClick={goToPreviousStep}
                        disabled={isFirstStep}
                    >
                        <ChevronLeft />
                    </Button>
                    <TelemetryBreadcrumbs />
                </div>
                <div className="ml-auto flex flex-row gap-3 items-center">
                    {selectedMeeting && (
                        <div className="flex flex-row items-center gap-3 text-sm font-extralight">
                            {selectedMeeting.meeting_official_name}
                            <Info />
                        </div>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <RotateCcw className="cursor-pointer" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset telemetry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will clear all selected data and return you to the first step. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={resetTelemetry}>
                                    Reset
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`[&_svg]:size-6 ${isLastStep ? "text-default-200" : ""}`}
                        onClick={goToNextStep}
                        disabled={isLastStep}
                    >
                        <ChevronRight />
                    </Button>
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