// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    DriverParams,
    MeetingParams,
    RaceControlParams,
    SessionParams,
    StintParams,
    TeamRadioParams,
    WeatherParams,
    LapParams,
    PositionParams,
    IntervalParams,
} from "../../interfaces/openF1";
import {
    fetchDrivers,
    fetchIntervals,
    fetchLaps,
    fetchMeeting,
    fetchPosition,
    fetchRaceControl,
    fetchSession,
    fetchStint,
    fetchTeamRadio,
    fetchWeather,
} from "../../services/openF1Api";
import TopBanner from "./TopBanner";
import LiveTiming from "./LiveTiming";
import RaceControl from "./RaceControl";
import TeamRadios from "./TeamRadio";
import LiveSettings from "./LiveSettings";
import { Divider } from "@nextui-org/react";
import { LiveSettingsProvider, useLiveSettings } from "./LiveSettingsContext";

const Dashboard: React.FC = () => {
    const [meeting, setMeeting] = useState<MeetingParams>();
    const [session, setSession] = useState<SessionParams>();
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [raceControl, setRaceControl] = useState<RaceControlParams[]>([]);
    const [teamRadio, setTeamRadio] = useState<TeamRadioParams[]>([]);
    const [weather, setWeather] = useState<WeatherParams>();
    const [stints, setStints] = useState<StintParams[]>([]);
    const [laps, setLaps] = useState<LapParams[]>([]);
    const [intervals, setIntervals] = useState<IntervalParams[]>([]);
    const [positions, setPositions] = useState<PositionParams[]>([]);

    const meeting_test = "latest";//1234;
    const session_test = "latest";//9507;

    const params = {
        meeting_key: meeting_test,
        session_key: session_test,
    };

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    async function fetchData() {
        const meetingParams: MeetingParams = { meeting_key: meeting_test };

        const fetchFunctions = [
            async () => {
                const meetingData = await fetchMeeting(meetingParams);
                setMeeting(meetingData[0]);
            },
            async () => {
                const sessionData = await fetchSession(params);
                setSession(sessionData[0]);
            },
            async () => {
                const driverData = await fetchDrivers(params);
                setDrivers(driverData);
            },
            async () => {
                const controlData = await fetchRaceControl(params);
                setRaceControl(controlData);
            },
            async () => {
                const radioData = await fetchTeamRadio(params);
                setTeamRadio(radioData);
            },
            async () => {
                const weatherData = await fetchWeather(params);
                setWeather(weatherData.pop());
            },
            async () => {
                const stintData = await fetchStint(params);
                setStints(stintData);
            },
            async () => {
                const lapData = await fetchLaps(params);
                setLaps(lapData);
            },
            async () => {
                const intervalData = await fetchIntervals(params);
                setIntervals(intervalData);
            },
            async () => {
                const positionData = await fetchPosition(params);
                setPositions(positionData);
            },
        ];

        for (let i = 0; i < fetchFunctions.length; i++) {
            await fetchFunctions[i]();
            if (i < fetchFunctions.length - 1) {
                await delay(350); // 350 ms delay between calls to stay within rate limit
            }
        }
    }

    useEffect(() => {fetchData();});

    return (
        <LiveSettingsProvider>
            <DashboardContent
                meeting={meeting}
                session={session}
                drivers={drivers}
                raceControl={raceControl}
                teamRadio={teamRadio}
                weather={weather}
                stints={stints}
                laps={laps}
                intervals={intervals}
                positions={positions}
            />
        </LiveSettingsProvider>
    );
};

interface DashboardContentProps {
    meeting: MeetingParams | undefined;
    session: SessionParams | undefined;
    drivers: DriverParams[];
    raceControl: RaceControlParams[];
    teamRadio: TeamRadioParams[];
    weather: WeatherParams | undefined;
    stints: StintParams[];
    laps: LapParams[];
    intervals: IntervalParams[];
    positions: PositionParams[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
    meeting,
    session,
    drivers,
    raceControl,
    teamRadio,
    weather,
    stints,
    laps,
    intervals,
    positions,
}) => {
    const { settings } = useLiveSettings();

    const findSetting = (name: string) => settings.find(setting => setting.name === name);

    const isBanner = findSetting('Show Stats Banner')?.value;
    const isLive = findSetting('Show Live Table')?.value;
    const isRace = findSetting('Show Race Control')?.value;
    const isRadio = findSetting('Show Team Radio')?.value;

    return (
        <div className="mx-auto">
            <div className="flex flex-row items-center w-full h-10">
                {isBanner && meeting && session && weather && (
                    <div className="flex-grow overflow-hidden my-auto">
                        <TopBanner meeting={meeting} session={session} weather={weather} />
                    </div>
                )}
                <Divider orientation="vertical" />
                {drivers && stints && laps && positions && (
                    <div className="mx-2 flex align-middle">
                        <LiveSettings />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-1 xl:grid-cols-2">
                {drivers && stints && laps && positions && isLive && (
                    <div className="col-span-1 xl:col-span-1 m-3">
                        <LiveTiming
                            drivers={drivers}
                            stints={stints}
                            laps={laps}
                            positions={positions}
                            intervals={intervals}
                        />
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
                    {raceControl && isRace && (
                        <div className="col-span-2 md:col-span-1">
                            <RaceControl drivers={drivers} raceControl={raceControl} />
                        </div>
                    )}
                    {teamRadio && isRadio && (
                        <div className="col-span-2 md:col-span-1">
                            <TeamRadios drivers={drivers} teamRadio={teamRadio} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
