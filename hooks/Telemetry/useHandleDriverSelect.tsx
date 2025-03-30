// @/hooks/Telemetry/useHandleDriverSelect.tsx

import { useTelemetry } from "@/context/TelemetryContext";
import { useEffect } from "react";

export const useHandleDriverSelect = () => {
    const { selectedDrivers, setIsShowLapTimes, setIsShowTelemetry } = useTelemetry();

    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
        setIsShowTelemetry(false)
    }, [selectedDrivers, setIsShowLapTimes, setIsShowTelemetry]);
};