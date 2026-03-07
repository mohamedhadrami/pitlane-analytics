// @/hooks/Telemetry/useFetchSessions.tsx

import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { fetchSession } from "@/services/openF1Api";
import type { OFSessionParams } from "@/types/openF1.types";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFetchSessions = (paramsProcessed: boolean) => {
    const {
        meetings,
        selectedMeetingKey,
        setSelectedMeeting,
        setSessions,
        setSelectedSessionKey
    } = useTelemetry();

    useEffect(() => {
        if (!paramsProcessed) return;

        if (!selectedMeetingKey || !meetings) {
            setSelectedMeeting(undefined);
            setSessions([]);
            setSelectedSessionKey(undefined);
            return;
        }

        const fetchData = async () => {
            const params: OFSessionParams = { meeting_key: selectedMeetingKey };
            const fetchedSessions = await fetchSession(params);
            if (fetchedSessions.length === 0) throw new Error("No sessions fetched. Checked if meeting key is correct.")
            setSessions(fetchedSessions);
            const meeting = meetings?.find(v => v.meeting_key === selectedMeetingKey);
            setSelectedMeeting(meeting);
        };

        const dataPromise = fetchData();
        toast.promise(Promise.all([dataPromise]), {
            loading: "Loading sessions...",
            success: "Sessions loaded successfully!",
            error: (e: Error) => `${e.message}`,
        });
    }, [paramsProcessed, selectedMeetingKey, setSelectedMeeting, setSelectedSessionKey, setSessions, meetings]);

};