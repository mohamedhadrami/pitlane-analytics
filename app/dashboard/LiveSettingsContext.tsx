// app/dashboard/LiveSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type StateType = boolean | string | number;

export interface LiveSetting<T extends StateType> {
    category: string;
    name: string;
    type: 'boolean' | 'string' | 'number';
    value: T;
    setValue: (value: T) => void;
}

interface LiveSettingsContextType {
    settings: LiveSetting<any>[];
}

const LiveSettingsContext = createContext<LiveSettingsContextType | undefined>(undefined);

export const LiveSettingsProvider = ({ children }: { children: ReactNode }) => {
    // MAIN page
    const [isBanner, setIsBanner] = useState(true);
    const [isLive, setIsLive] = useState(true);
    const [isRace, setIsRace] = useState(true);
    const [isRadio, setIsRadio] = useState(true);

    // LIVE Timing
    const [isShowFastestLap, setIsShowFastestLap] = useState(true);
    const [isShowTyre, setIsShowTyre] = useState(true);
    const [isShowGapToLeader, setIsShowGapToLeader] = useState(true);
    const [isShowStintNumber, setIsShowStintNumber] = useState(true);

    // RACE Control
    const [isShowRaceControlTime, setIsShowRaceControlTime] = useState(true);
    const [isShowRedFlag, setIsShowRedFlag] = useState(true);
    const [isShowBlueFlag, setIsShowBlueFlag] = useState(true);

    // TEAM Radio
    const [isShowTeamRadioTime, setIsShowTeamRadioTime] = useState(true);

    // Example of a string setting
    const [fastestLapColor, setFastestLapColor] = useState('#ff0000');

    const settings: LiveSetting<any>[] = [
        { category: "stats-banner", name: 'Show Stats Banner', type: 'boolean', value: isBanner, setValue: setIsBanner },
        { category: "live-table", name: 'Show Live Table', type: 'boolean', value: isLive, setValue: setIsLive },
        { category: "live-table", name: 'Show Fastest Lap', type: 'boolean', value: isShowFastestLap, setValue: setIsShowFastestLap },
        { category: "live-table", name: 'Show Tyre', type: 'boolean', value: isShowTyre, setValue: setIsShowTyre },
        { category: "live-table", name: 'Show Gap To Leader', type: 'boolean', value: isShowGapToLeader, setValue: setIsShowGapToLeader },
        { category: "live-table", name: 'Show Stint Number', type: 'boolean', value: isShowStintNumber, setValue: setIsShowStintNumber },
        { category: "race-control", name: 'Show Race Control', type: 'boolean', value: isRace, setValue: setIsRace },
        { category: "race-control", name: 'Show Race Control Time', type: 'boolean', value: isShowRaceControlTime, setValue: setIsShowRaceControlTime },
        { category: "race-control", name: 'Show Red Flag', type: 'boolean', value: isShowRedFlag, setValue: setIsShowRedFlag },
        { category: "race-control", name: 'Show Blue Flag', type: 'boolean', value: isShowBlueFlag, setValue: setIsShowBlueFlag },
        { category: "team-radio", name: 'Show Team Radio', type: 'boolean', value: isRadio, setValue: setIsRadio },
        { category: "team-radio", name: 'Show Team Radio Time', type: 'boolean', value: isShowTeamRadioTime, setValue: setIsShowTeamRadioTime },
        { category: "team-radio", name: 'Fastest Lap Color', type: 'string', value: fastestLapColor, setValue: setFastestLapColor },
    ];

    return (
        <LiveSettingsContext.Provider value={{ settings }}>
            {children}
        </LiveSettingsContext.Provider>
    );
};

export const useLiveSettings = () => {
    const context = useContext(LiveSettingsContext);
    if (context === undefined) {
        throw new Error('useLiveSettings must be used within a LiveSettingsProvider');
    }
    return context;
};
