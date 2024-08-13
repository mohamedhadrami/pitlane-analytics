// @/hooks/useTelemetryUI.tsx

import { useTelemetry } from "@/context/TelemetryContext";
import { TelemetryStage, useTelemetryUI } from "@/context/TelemetryUIContext"
import { useEffect } from "react";


export const useHandleCurrentStage = () => {
    const {
        selectedYear,
        selectedMeeting,
        selectedSession,
        selectedDrivers,
        selectedLap,
        isShowLapTimes,
        isShowTelemetry
    } = useTelemetry();
    const { setCurrentStage } = useTelemetryUI();

    useEffect(() => {
        if (!selectedYear) setCurrentStage(TelemetryStage.Year)
        else if (!selectedMeeting) setCurrentStage(TelemetryStage.Meeting)
        else if (!selectedSession) setCurrentStage(TelemetryStage.Session)
        else if (!selectedDrivers.size) setCurrentStage(TelemetryStage.StatsDrivers)
        else if (isShowLapTimes) setCurrentStage(TelemetryStage.DriverLap)
        else if (isShowTelemetry) setCurrentStage(TelemetryStage.LapTelemetry)
    }, [selectedYear,
        selectedMeeting,
        selectedSession,
        selectedDrivers,
        selectedLap,
        isShowLapTimes,
        isShowTelemetry])
}

export const useHandleNextStage = () => {
    const { nextStage, setCurrentStage } = useTelemetryUI();

    const nextStep = () => {
        if (nextStage !== undefined) {
            setCurrentStage(nextStage);
        }
    };

    return nextStep;
}

export const useHandlePreviousStage = () => {
    const { previousStage, setCurrentStage } = useTelemetryUI();

    const previousStep = () => {
        if (previousStage !== undefined) {
            setCurrentStage(previousStage);
        }
    };

    return previousStep;
}

