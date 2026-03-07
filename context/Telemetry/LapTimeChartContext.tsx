// @/context/Telemetry/LapTimeChartContext.tsk

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface LapTimeChartSettings {
    isRaceControl: boolean;
    isTyres: boolean;
    isOutlierDetection: boolean;
    customLowerThreshold: number;
    customUpperThreshold: number;
    iqrMultiplier: number;
    zscoreThreshold: number;
    modZscoreThreshold: number;
    outlierMethod: string;
}

interface LapTimeChartContextProps extends LapTimeChartSettings {
    setIsRaceControl: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTyres: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOutlierDetection: React.Dispatch<React.SetStateAction<boolean>>;
    setCustomLowerThreshold: React.Dispatch<React.SetStateAction<number>>;
    setCustomUpperThreshold: React.Dispatch<React.SetStateAction<number>>;
    setIqrMultiplier: React.Dispatch<React.SetStateAction<number>>;
    setZscoreThreshold: React.Dispatch<React.SetStateAction<number>>;
    setModZscoreThreshold: React.Dispatch<React.SetStateAction<number>>;
    setOutlierMethod: React.Dispatch<React.SetStateAction<string>>;
}

const LapTimeChartContext = createContext<LapTimeChartContextProps | undefined>(undefined);

export const useLapTimeChart = (): LapTimeChartContextProps => {
    const context = useContext(LapTimeChartContext);
    if (!context) {
        throw new Error("useLapTimeChart must be used within a LapTimeChartProvider");
    }
    return context;
};

const defaultSettings: LapTimeChartSettings = {
    isRaceControl: true,
    isTyres: true,
    isOutlierDetection: true,
    customLowerThreshold: -1,
    customUpperThreshold: -1,
    iqrMultiplier: 1.5,
    zscoreThreshold: 3,
    modZscoreThreshold: 3,
    outlierMethod: "iqr",
};

export const LapTimeChartProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<LapTimeChartSettings>(() => {
        if (typeof window === 'undefined') return defaultSettings;

        return JSON.parse(localStorage.getItem("lapTimeChartSettings") || JSON.stringify(defaultSettings));
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("lapTimeChartSettings", JSON.stringify(settings));
        }
    }, [settings]);

    const updateSetting = <K extends keyof LapTimeChartSettings>(
        key: K,
        value: React.SetStateAction<LapTimeChartSettings[K]>
    ) => {
        setSettings(prev => ({
            ...prev,
            [key]: typeof value === 'function' ? (value as (prevState: LapTimeChartSettings[K]) => LapTimeChartSettings[K])(prev[key]) : value,
        }));
    };

    return (
        <LapTimeChartContext.Provider
            value={{
                ...settings,
                setIsRaceControl: (value) => updateSetting('isRaceControl', value),
                setIsTyres: (value) => updateSetting('isTyres', value),
                setIsOutlierDetection: (value) => updateSetting('isOutlierDetection', value),
                setCustomLowerThreshold: (value) => updateSetting('customLowerThreshold', value),
                setCustomUpperThreshold: (value) => updateSetting('customUpperThreshold', value),
                setIqrMultiplier: (value) => updateSetting('iqrMultiplier', value),
                setZscoreThreshold: (value) => updateSetting('zscoreThreshold', value),
                setModZscoreThreshold: (value) => updateSetting('modZscoreThreshold', value),
                setOutlierMethod: (value) => updateSetting('outlierMethod', value),
            }}
        >
            {children}
        </LapTimeChartContext.Provider>
    );
};

