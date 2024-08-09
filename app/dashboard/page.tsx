// @/app/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Divider } from "@nextui-org/react";
import { LiveSettingsProvider, useLiveSettings } from "@/context/LiveSettingsContext";
import { useFooter } from "@/context/FooterContext";
import { mvCircuit } from "@/interfaces/multiviewer";
import { LiveArchiveStatus, LiveLapCount, LiveTrackStatus } from "@/interfaces/liveTiming";
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
} from "@/interfaces/openF1";
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
} from "@/services/openF1Api";
import { fetchCircuitByKey } from "@/services/mvApi";
import { fetchLiveArchiveStatus, fetchLiveLapCount, fetchLiveSessionPath, fetchLiveTrackStatus } from "@/services/liveTimingApi";
import TopBanner from "@/components/Dashboard/TopBanner";
import LiveTiming from "@/components/Dashboard/LiveTiming";
import RaceControl from "@/components/Dashboard/RaceControl";
import TeamRadios from "@/components/Dashboard/TeamRadio";
import LiveSettings from "@/components/Dashboard/LiveSettings";
import Loading from "@/components/Loading";
import RaceStatus from "@/components/Dashboard/RaceStatus";
import TrackMap from "@/components/Dashboard/TrackMap";
import { delay } from "@/utils/helpers";


const Dashboard: React.FC = () => {
    const { setFooterVisible } = useFooter();

    useEffect(() => {
        setFooterVisible(false);

        return () => {
            setFooterVisible(true);
        };
    }, [setFooterVisible]);


    // OPENF1

    const [year, setYear] = useState<number>();
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

    const meeting_test = "latest";
    const session_test = "latest";

    const params = useMemo(() => ({
        meeting_key: meeting_test,
        session_key: session_test,
    }), [meeting_test, session_test]);

    useEffect(() => {
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
                    await delay(350);
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
    }, [setMeeting, setSession, setDrivers, setRaceControl, setTeamRadio, setWeather, setStints, setLaps, setIntervals, setPositions, params]);


    // MULTIVIEWER

    const [circuitData, setCircuitData] = useState<mvCircuit>();

    useEffect(() => {
        const fetchCircuitData = async () => {
            if (meeting?.circuit_key && meeting?.year) {
                const res = await fetchCircuitByKey(meeting.circuit_key, meeting.year.toString());
                setCircuitData(res);
            }
        };
        fetchCircuitData();
    }, [meeting]);


    // LIVETIMING
    const [sessionPath, setSessionPath] = useState<string>();
    const [archiveStatus, setArchiveStatus] = useState<LiveArchiveStatus>();
    const [trackStatus, setTrackStatus] = useState<LiveTrackStatus>();
    const [lapCount, setLapCount] = useState<LiveLapCount>();

    useEffect(() => {
        const fetchData = async () => {
            let year = meeting?.year;
            if (year) {
                const path = await fetchLiveSessionPath(year, meeting?.meeting_key!, session?.session_key!);
                const liveLapCount: LiveLapCount = await fetchLiveLapCount(path);
                setLapCount(liveLapCount)
                const liveArchiveStatus: LiveArchiveStatus = await fetchLiveArchiveStatus(path);
                setArchiveStatus(liveArchiveStatus)
                const liveTrackStatus: LiveTrackStatus = await fetchLiveTrackStatus(path);
                setTrackStatus(liveTrackStatus)
            }
        }
        fetchData();
    }, [meeting, session])

    return (
        <LiveSettingsProvider>
            <DashboardContent
                meeting={meeting!}
                session={session!}
                drivers={drivers}
                raceControl={raceControl}
                teamRadio={teamRadio}
                weather={weather!}
                stints={stints}
                laps={laps}
                intervals={intervals}
                positions={positions}

                circuitData={circuitData!}

                archiveStatus={archiveStatus!}
                trackStatus={trackStatus!}
                lapCount={lapCount!}
            />
        </LiveSettingsProvider>
    );
};

interface DashboardContentProps {
    meeting: MeetingParams;
    session: SessionParams;
    drivers: DriverParams[];
    raceControl: RaceControlParams[];
    teamRadio: TeamRadioParams[];
    weather: WeatherParams;
    stints: StintParams[];
    laps: LapParams[];
    intervals: IntervalParams[];
    positions: PositionParams[];

    circuitData: mvCircuit;

    archiveStatus: LiveArchiveStatus;
    trackStatus: LiveTrackStatus;
    lapCount: LiveLapCount;
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

    circuitData,

    archiveStatus,
    trackStatus,
    lapCount,
}) => {
    const { settings } = useLiveSettings();

    const findSetting = (name: string) => settings.find(setting => setting.name === name);

    const isBanner = findSetting('Show Stats Banner')?.value;
    const isLive = findSetting('Show Live Table')?.value;
    const isRace = findSetting('Show Race Control')?.value;
    const isRadio = findSetting('Show Team Radio')?.value;
    const isTrack = findSetting('Show Track')?.value;

    return (
        <div className="mx-auto">
            <div className="fixed right-0 top-0 z-10 items-center w-full h-10">
                <div className="border-b border-zinc-800 bg-black">
                    <div className="flex flex-row items-center w-full h-10">
                        <div className="flex-grow overflow-hidden my-auto">
                            {isBanner && meeting && session && weather && (
                                <TopBanner meeting={meeting} session={session} weather={weather} />
                            )}
                        </div>
                        <Divider orientation="vertical" />
                        <div className="flex justify-end align-middle mx-5">
                            {drivers && stints && laps && positions && (<LiveSettings />)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-10">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="col-span-1 xl:col-span-1 m-3">
                        {drivers && stints && laps && positions && isLive && (
                            <LiveTiming
                                drivers={drivers}
                                stints={stints}
                                laps={laps}
                                positions={positions}
                                intervals={intervals}
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 xl:grid-rows-3 xl:grid-cols-1 xl:border-l border-zinc-800 max-h-full">
                        <div className="col-span-2 xl:col-span-1 xl:row-span-1 xl:p-5 xl:border-b border-zinc-800">
                            {isRace && raceControl.length > 0 ? (
                                <RaceControl drivers={drivers} raceControl={raceControl} />
                            ) : <Loading />}
                        </div>
                        <div className="col-span-1 xl:col-span-1 xl:row-span-1 xl:p-5">
                            {isRadio && teamRadio.length > 0 ? (
                                <TeamRadios drivers={drivers} teamRadio={teamRadio} />
                            ) : <Loading />}
                        </div>
                        {circuitData && isTrack && (
                            <div className="col-span-3 lg:col-span-1 xl:p-5 xl:border-t border-zinc-800">
                                <TrackMap circuitData={circuitData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {archiveStatus && trackStatus && lapCount && (
                <RaceStatus archiveStatus={archiveStatus} trackStatus={trackStatus} lapCount={lapCount} />
            )}
        </div>
    );
};

export default Dashboard;
