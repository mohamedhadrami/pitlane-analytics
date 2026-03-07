// @/hooks/Telemetry/useFetchYears.tsx

import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { useEffect } from "react";

export const useFetchYears = (paramsProcessed: boolean) => {
    const { setYears } = useTelemetry();

    useEffect(() => {
        if (!paramsProcessed) return;

        const currentYear = new Date().getFullYear();
        const availableYears = Array.from(
            { length: currentYear - 2022 },
            (_, index) => (currentYear - index).toString()
        );
        setYears(availableYears);
    }, [paramsProcessed, setYears]);

};