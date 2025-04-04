// @/hooks/Telemetry/useFetchMeetings.tsx

import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { fetchMeeting } from "@/services/openF1Api";
import type { OFMeetingParams } from "@/types/openF1.types";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFetchMeetings = () => {
    const { selectedYear, setMeetings, setSelectedMeetingKey } = useTelemetry();

    useEffect(() => {
        if (!selectedYear) {
            setMeetings([]);
            setSelectedMeetingKey(undefined);
            return;
        }

        const fetchData = async () => {
            const params: OFMeetingParams = { year: selectedYear };
            const fetchedMeetings = await fetchMeeting(params);
            if (fetchedMeetings.length === 0) throw new Error("No meetings fetched. Checked if year is within the correct range")
            setMeetings(fetchedMeetings);
        };

        const dataPromise = fetchData();
        toast.promise(Promise.all([dataPromise]), {
            loading: "Loading meetings...",
            success: "Meetings loaded successfully!",
            error: (e: Error) => `${e.message}`,
        });

    }, [selectedYear, setMeetings, setSelectedMeetingKey]);

};