// @/hooks/useTelemetryUI.tsx

import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { TelemetryStage, useTelemetryUI } from "@/context/Telemetry/TelemetryUIContext"
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
    const { nextStage, setCurrentStage, setDirection } = useTelemetryUI();

    const nextStep = () => {
        if (nextStage !== undefined) {
            setDirection('next');
            setTimeout(() => {
                setCurrentStage(nextStage);
            }, 50);
        }
    };

    return nextStep;
}

export const useHandlePreviousStage = () => {
    const { previousStage, setCurrentStage, setDirection } = useTelemetryUI();

    const previousStep = () => {
        if (previousStage !== undefined) {
            setDirection('previous');
            setTimeout(() => {
                setCurrentStage(previousStage);
            }, 50);
        }
    };

    return previousStep;
}
