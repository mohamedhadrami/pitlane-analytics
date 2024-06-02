// app/dashboard/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
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
import TopBanner from "@/components/Dashboard/TopBanner";
import LiveTiming from "@/components/Dashboard/LiveTiming";
import RaceControl from "@/components/Dashboard/RaceControl";
import TeamRadios from "@/components/Dashboard/TeamRadio";
import LiveSettings from "@/components/Dashboard/LiveSettings";
import { Divider } from "@nextui-org/react";
import { LiveSettingsProvider, useLiveSettings } from "@/components/Dashboard/LiveSettingsContext";
import { delay } from "@/utils/helpers";


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

    const fetchOnceRef = useRef(false);

    useEffect(() => {
        const meeting_test = "latest";
        const session_test = "latest";

        const params = {
            meeting_key: meeting_test,
            session_key: session_test,
        };

        async function fetchData() {
            const meetingParams: MeetingParams = { meeting_key: meeting_test };

            const fetchFunctions = [
                async () => {
                    const meetingData = await fetchMeeting(meetingParams);
                    sessionStorage.setItem('meeting', JSON.stringify(meetingData[0]));
                    setMeeting(meetingData[0]);
                },
                async () => {
                    const sessionData = await fetchSession(params);
                    sessionStorage.setItem('session', JSON.stringify(sessionData[0]));
                    setSession(sessionData[0]);
                },
                async () => {
                    const driverData = await fetchDrivers(params);
                    sessionStorage.setItem('drivers', JSON.stringify(driverData));
                    setDrivers(driverData);
                },
                async () => {
                    const controlData = await fetchRaceControl(params);
                    sessionStorage.setItem('raceControl', JSON.stringify(controlData));
                    setRaceControl(controlData);
                },
                async () => {
                    const radioData = await fetchTeamRadio(params);
                    sessionStorage.setItem('teamRadio', JSON.stringify(radioData));
                    setTeamRadio(radioData);
                },
                async () => {
                    const weatherData = await fetchWeather(params);
                    sessionStorage.setItem('weather', JSON.stringify(weatherData.pop()));
                    setWeather(weatherData.pop());
                },
                async () => {
                    const stintData = await fetchStint(params);
                    sessionStorage.setItem('stints', JSON.stringify(stintData));
                    setStints(stintData);
                },
                async () => {
                    const lapData = await fetchLaps(params);
                    sessionStorage.setItem('laps', JSON.stringify(lapData));
                    setLaps(lapData);
                },
                async () => {
                    const intervalData = await fetchIntervals(params);
                    sessionStorage.setItem('intervals', JSON.stringify(intervalData));
                    setIntervals(intervalData);
                },
                async () => {
                    const positionData = await fetchPosition(params);
                    sessionStorage.setItem('positions', JSON.stringify(positionData));
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

        if (fetchOnceRef.current) return;

        const cachedMeeting = sessionStorage.getItem('meeting');
        const cachedSession = sessionStorage.getItem('session');
        const cachedDrivers = sessionStorage.getItem('drivers');
        const cachedRaceControl = sessionStorage.getItem('raceControl');
        const cachedTeamRadio = sessionStorage.getItem('teamRadio');
        const cachedWeather = sessionStorage.getItem('weather');
        const cachedStints = sessionStorage.getItem('stints');
        const cachedLaps = sessionStorage.getItem('laps');
        const cachedIntervals = sessionStorage.getItem('intervals');
        const cachedPositions = sessionStorage.getItem('positions');

        if (cachedMeeting) setMeeting(JSON.parse(cachedMeeting));
        if (cachedSession) setSession(JSON.parse(cachedSession));
        if (cachedDrivers) setDrivers(JSON.parse(cachedDrivers));
        if (cachedRaceControl) setRaceControl(JSON.parse(cachedRaceControl));
        if (cachedTeamRadio) setTeamRadio(JSON.parse(cachedTeamRadio));
        if (cachedWeather) setWeather(JSON.parse(cachedWeather));
        if (cachedStints) setStints(JSON.parse(cachedStints));
        if (cachedLaps) setLaps(JSON.parse(cachedLaps));
        if (cachedIntervals) setIntervals(JSON.parse(cachedIntervals));
        if (cachedPositions) setPositions(JSON.parse(cachedPositions));

        if (!cachedMeeting || !cachedSession || !cachedDrivers || !cachedRaceControl || !cachedTeamRadio || !cachedWeather || !cachedStints || !cachedLaps || !cachedIntervals || !cachedPositions) {
            fetchData();
        }

        fetchOnceRef.current = true;
    }, [ setMeeting, setSession, setDrivers, setRaceControl, setTeamRadio, setWeather, setStints, setLaps, setIntervals, setPositions]);

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
            <div className="flex flex-row items-center w-full h-10 border-b-1 border-zinc-800">
                {isBanner && meeting && session && weather && (
                    <div className="flex-grow overflow-hidden my-auto">
                        <TopBanner meeting={meeting} session={session} weather={weather} />
                    </div>
                )}
                <Divider orientation="vertical" />
                {drivers && stints && laps && positions && (
                    <div className="flex align-middle mx-5">
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
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-1 xl:border-l-1 border-zinc-800">
                    {raceControl && isRace && (
                        <div className="col-span-2 md:col-span-1 xl:p-5 xl:border-b-1 border-zinc-800">
                            <RaceControl drivers={drivers} raceControl={raceControl} />
                        </div>
                    )}
                    {teamRadio && isRadio && (
                        <div className="col-span-2 md:col-span-1 xl:p-5">
                            <TeamRadios drivers={drivers} teamRadio={teamRadio} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
