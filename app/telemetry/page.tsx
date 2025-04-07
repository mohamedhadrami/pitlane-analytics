// @/app/telemetry/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Divider } from "@heroui/react";

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
import { LapTimeChartProvider } from "@/context/Telemetry/LapTimeChartContext";

const PageContent: React.FC = () => {
    const { setFooterVisible } = useFooter();
    const {
        setSelectedYear,
        setSelectedMeetingKey,
        setSelectedSessionKey,
    } = useTelemetry();

    const searchParams = useSearchParams();
    const [paramsProcessed, setParamsProcessed] = useState(false);

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
            if (queryMeeting) setSelectedMeetingKey(Number.parseInt(queryMeeting));
            if (querySession) setSelectedSessionKey(Number.parseInt(querySession));

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