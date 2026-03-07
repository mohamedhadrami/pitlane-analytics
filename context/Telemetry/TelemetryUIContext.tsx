// @/hooks/TelemetryUIContext.tsx

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export enum TelemetryStage {
    Year,
    Meeting,
    Session,
    StatsDrivers,
    DriverLap,
    LapTelemetry,
    Telemetry
}

interface TelemetryUIContextProps {
    currentStage: TelemetryStage;
    setCurrentStage: React.Dispatch<React.SetStateAction<TelemetryStage>>;
    nextStage: TelemetryStage | undefined;
    previousStage: TelemetryStage | undefined;
    direction: 'next' | 'previous';
    setDirection: React.Dispatch<React.SetStateAction<'next' | 'previous'>>;
}

const TelemetryUIContext = createContext<TelemetryUIContextProps | undefined>(undefined);

export const useTelemetryUI = (): TelemetryUIContextProps => {
    const context = useContext(TelemetryUIContext);
    if (!context) {
        throw new Error("useTelemetryUI must be used within a TelemetryUIProvider");
    }
    return context;
}

export const TelemetryUIProvider = ({ children }: { children: ReactNode }) => {
    const [currentStage, setCurrentStage] = useState<TelemetryStage>(TelemetryStage.Year);
    const [nextStage, setNextStage] = useState<TelemetryStage | undefined>(TelemetryStage.Meeting);
    const [previousStage, setPreviousStage] = useState<TelemetryStage | undefined>();
    const [direction, setDirection] = useState<'next' | 'previous'>('next');

    useEffect(() => {
        if (currentStage === TelemetryStage.Year) {
            setPreviousStage(undefined);
            setNextStage(currentStage + 1);
        } else if (currentStage === TelemetryStage.Telemetry) {
            setPreviousStage(currentStage - 1);
            setNextStage(undefined);
        } else {
            setPreviousStage(currentStage - 1);
            setNextStage(currentStage + 1);
        }
    }, [currentStage]);


    return (
        <TelemetryUIContext.Provider value={{
            currentStage, setCurrentStage,
            nextStage, 
            previousStage,
            direction, setDirection
        }}>
            {children}
        </TelemetryUIContext.Provider>
    )
}