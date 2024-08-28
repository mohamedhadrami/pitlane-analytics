// @/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";

import { useSignalR } from "@/context/SignalRProvider";
import { LiveSettingsProvider, useLiveSettings } from "@/context/LiveSettingsContext";
import { fetchCircuitByKey } from "@/services/mvApi";
import { mvCircuit } from "@/interfaces/multiviewer";
import {
    LiveArchiveStatus,
    LiveAudioStreams,
    LiveCarData,
    LiveCarDataZ,
    LiveChampionshipPrediction,
    LiveContentStreams,
    LiveCurrentTyres,
    LiveDriverList,
    LiveDriverRaceInfo,
    LiveExtrapolatedClock,
    LiveHeartbeat,
    LiveLapCount,
    LiveLapSeries,
    LivePitLaneTimeCollection,
    LivePosition,
    LivePositionZ,
    LiveRaceControlMessages,
    LiveSessionData,
    LiveSessionInfo,
    LiveSessionStatus,
    LiveTeamRadio,
    LiveTimingAppData,
    LiveTimingData,
    LiveTimingDataF1,
    LiveTimingStats,
    LiveTlaRcm,
    LiveTopThree,
    LiveTrackStatus,
    LiveTyreStintSeries,
    LiveWeatherData,
    LiveWeatherDataSeries
} from "@/interfaces/liveTiming.type";

import TopBanner from "@/components/Live/TopBanner";
import LiveTiming from "@/components/Live/LiveTiming";
import RaceControl from "@/components/Live/RaceControl";
import TeamRadios from "@/components/Live/TeamRadio";
import LiveSettings from "@/components/Live/LiveSettings";
import RaceStatus from "@/components/Live/RaceStatus";

import { Divider } from "@nextui-org/react";
import CircuitMap from "@/components/Live/CircuitMap";

const LiveDashboard: React.FC = () => {

    const { data } = useSignalR();

    const [sessionInfo, setSessionInfo] = useState<LiveSessionInfo>();
    const [archiveStatus, setArchiveStatus] = useState<LiveArchiveStatus>();
    const [trackStatus, setTrackStatus] = useState<LiveTrackStatus>();
    const [sessionData, setSessionData] = useState<LiveSessionData>();
    const [contentStreams, setContentStreams] = useState<LiveContentStreams>();
    const [championshipPrediction, setChampionshipPrediction] = useState<LiveChampionshipPrediction>();
    const [audioStreams, setAudioStreams] = useState<LiveAudioStreams>();
    const [driverList, setDriverList] = useState<LiveDriverList>();
    const [timingDataF1, setTimingDataF1] = useState<LiveTimingDataF1>();
    const [topThree, setTopThree] = useState<LiveTopThree>();
    const [timingData, setTimingData] = useState<LiveTimingData>();
    const [lapSeries, setLapSeries] = useState<LiveLapSeries>();
    const [timingAppData, setTimingAppData] = useState<LiveTimingAppData>();
    const [timingStats, setTimingStats] = useState<LiveTimingStats>();
    const [extrapolatedClock, setExtrapolatedClock] = useState<LiveExtrapolatedClock>();
    const [positionZ, setPositionZ] = useState<LivePositionZ>();
    const [carDataZ, setCarDataZ] = useState<LiveCarDataZ>();
    const [tyreStintSeries, setTyreStintSeries] = useState<LiveTyreStintSeries>();
    const [lapCount, setLapCount] = useState<LiveLapCount>();
    const [driverRaceInfo, setDriverRaceInfo] = useState<LiveDriverRaceInfo>();
    const [sessionStatus, setSessionStatus] = useState<LiveSessionStatus>();
    const [heartbeat, setHeartbeat] = useState<LiveHeartbeat>();
    const [weatherData, setWeatherData] = useState<LiveWeatherData>();
    const [weatherDataSeries, setWeatherDataSeries] = useState<LiveWeatherDataSeries>();
    const [teamRadio, setTeamRadio] = useState<LiveTeamRadio>();
    const [tlaRcm, setTlaRcm] = useState<LiveTlaRcm>();
    const [raceControlMessages, setRaceControlMessages] = useState<LiveRaceControlMessages>();
    const [currentTyres, setCurrentTyres] = useState<LiveCurrentTyres>();
    const [pitLaneTimeCollection, setPitLaneTimeCollection] = useState<LivePitLaneTimeCollection>();
    const [carData, setCarData] = useState<LiveCarData>();
    const [position, setPosition] = useState<LivePosition>();

    useEffect(() => {
        if (data) {
            setSessionInfo(data.SessionInfo ?? sessionInfo);
            setArchiveStatus(data.ArchiveStatus ?? archiveStatus);
            setTrackStatus(data.TrackStatus ?? trackStatus);
            setSessionData(data.SessionData ?? sessionData);
            setContentStreams(data.ContentStreams ?? contentStreams);
            setChampionshipPrediction(data.ChampionshipPrediction ?? championshipPrediction);
            setAudioStreams(data.AudioStreams ?? audioStreams);
            setDriverList(data.DriverList ?? driverList);
            setTimingDataF1(data.TimingDataF1 ?? timingDataF1);
            setTopThree(data.TopThree ?? topThree);
            setTimingData(data.TimingData ?? timingData);
            setLapSeries(data.LapSeries ?? lapSeries);
            setTimingAppData(data.TimingAppData ?? timingAppData);
            setTimingStats(data.TimingStats ?? timingStats);
            setExtrapolatedClock(data.ExtrapolatedClock ?? extrapolatedClock);
            setPositionZ(data.PositionZ ?? positionZ);
            setCarDataZ(data.CarDataZ ?? carDataZ);
            setTyreStintSeries(data.TyreStintSeries ?? tyreStintSeries);
            setLapCount(data.LapCount ?? lapCount);
            setDriverRaceInfo(data.DriverRaceInfo ?? driverRaceInfo);
            setSessionStatus(data.SessionStatus ?? sessionStatus);
            setHeartbeat(data.Heartbeat ?? heartbeat);
            setWeatherData(data.WeatherData ?? weatherData);
            setWeatherDataSeries(data.WeatherDataSeries ?? weatherDataSeries);
            setTeamRadio(data.TeamRadio ?? teamRadio);
            setTlaRcm(data.TlaRcm ?? tlaRcm);
            setRaceControlMessages(data.RaceControlMessages ?? raceControlMessages);
            setCurrentTyres(data.CurrentTyres ?? currentTyres);
            setPitLaneTimeCollection(data.PitLaneTimeCollection ?? pitLaneTimeCollection);
            setCarData(data.CarData ?? carData);
            setPosition(data.Position ?? position);
        }
    }, [data]);

    useEffect(() => {
        console.log(sessionInfo)
    }, [sessionInfo])

    // MULTIVIEWER

    const [circuitData, setCircuitData] = useState<mvCircuit>();

    useEffect(() => {
        const fetchCircuitData = async () => {
            if (sessionInfo && sessionInfo.Meeting.Circuit.Key) {
                // TODO: get year dynamically
                const res = await fetchCircuitByKey(sessionInfo.Meeting.Circuit.Key, "2024");
                setCircuitData(res);
            }
        };
        fetchCircuitData();
    }, [sessionInfo]);



    return (
        <LiveSettingsProvider>
            <LiveDashboardContent
                circuitData={circuitData!}

                sessionInfo={sessionInfo!}
                archiveStatus={archiveStatus!}
                trackStatus={trackStatus!}
                sessionData={sessionData!}
                contentStreams={contentStreams!}
                championshipPrediction={championshipPrediction!}
                audioStreams={audioStreams!}
                driverList={driverList!}
                timingDataF1={timingDataF1!}
                topThree={topThree!}
                timingData={timingData!}
                lapSeries={lapSeries!}
                timingAppData={timingAppData!}
                timingStats={timingStats!}
                extrapolatedClock={extrapolatedClock!}
                positionZ={positionZ!}
                carDataZ={carDataZ!}
                tyreStintSeries={tyreStintSeries!}
                lapCount={lapCount!}
                driverRaceInfo={driverRaceInfo!}
                sessionStatus={sessionStatus!}
                heartbeat={heartbeat!}
                weatherData={weatherData!}
                weatherDataSeries={weatherDataSeries!}
                teamRadio={teamRadio!}
                tlaRcm={tlaRcm!}
                raceControlMessages={raceControlMessages!}
                currentTyres={currentTyres!}
                pitLaneTimeCollection={pitLaneTimeCollection!}
                carData={carData!}
                position={position!}
            />
        </LiveSettingsProvider>
    );
};

interface DashboardContentProps {
    circuitData: mvCircuit;

    sessionInfo: LiveSessionInfo;
    archiveStatus: LiveArchiveStatus;
    trackStatus: LiveTrackStatus;
    sessionData: LiveSessionData;
    contentStreams: LiveContentStreams;
    championshipPrediction: LiveChampionshipPrediction;
    audioStreams: LiveAudioStreams;
    driverList: LiveDriverList;
    timingDataF1: LiveTimingDataF1;
    topThree: LiveTopThree;
    timingData: LiveTimingData;
    lapSeries: LiveLapSeries;
    timingAppData: LiveTimingAppData;
    timingStats: LiveTimingStats;
    extrapolatedClock: LiveExtrapolatedClock;
    positionZ: LivePositionZ;
    carDataZ: LiveCarDataZ;
    tyreStintSeries: LiveTyreStintSeries;
    lapCount: LiveLapCount;
    driverRaceInfo: LiveDriverRaceInfo;
    sessionStatus: LiveSessionStatus;
    heartbeat: LiveHeartbeat;
    weatherData: LiveWeatherData;
    weatherDataSeries: LiveWeatherDataSeries;
    teamRadio: LiveTeamRadio;
    tlaRcm: LiveTlaRcm;
    raceControlMessages: LiveRaceControlMessages;
    currentTyres: LiveCurrentTyres;
    pitLaneTimeCollection: LivePitLaneTimeCollection;
    carData: LiveCarData;
    position: LivePosition;
}

const LiveDashboardContent: React.FC<DashboardContentProps> = ({
    circuitData,

    sessionInfo,
    archiveStatus,
    trackStatus,
    sessionData,
    contentStreams,
    championshipPrediction,
    audioStreams,
    driverList,
    timingDataF1,
    topThree,
    timingData,
    lapSeries,
    timingAppData,
    timingStats,
    extrapolatedClock,
    positionZ,
    carDataZ,
    tyreStintSeries,
    lapCount,
    driverRaceInfo,
    sessionStatus,
    heartbeat,
    weatherData,
    weatherDataSeries,
    teamRadio,
    tlaRcm,
    raceControlMessages,
    currentTyres,
    pitLaneTimeCollection,
    carData,
    position
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
                            {isBanner && sessionInfo && weatherData && (
                                <TopBanner session={sessionInfo} weather={weatherData} />
                            )}
                        </div>
                        <Divider orientation="vertical" />
                        <div className="flex justify-end align-middle mx-5">
                            {driverList && (<LiveSettings />)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-10">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="col-span-1 xl:col-span-1 m-3">
                        {driverList && false && isLive && (
                            <LiveTiming
                                drivers={driverList}
                                currentTyres={currentTyres}
                                tyreStintSeries={tyreStintSeries}
                                timingAppData={timingAppData}
                                timingDataF1={timingDataF1}
                                timingStats={timingStats}
                                lapSeries={lapSeries}
                                carData={carData}
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 xl:grid-rows-3 xl:grid-cols-1 xl:border-l border-zinc-800 max-h-full">
                        <div className="col-span-2 xl:col-span-1 xl:row-span-1 xl:p-5 xl:border-b border-zinc-800">
                            {isRace && sessionInfo && raceControlMessages && (
                                <RaceControl drivers={driverList} rawRaceControl={raceControlMessages} gmtOffset={sessionInfo.GmtOffset} />
                            )}
                        </div>
                        <div className="col-span-1 xl:col-span-1 xl:row-span-1 xl:p-5">
                            {isRadio && false && sessionInfo && teamRadio && (
                                <TeamRadios drivers={driverList} rawTeamRadio={teamRadio} path={sessionInfo.Path} gmtOffset={sessionInfo.GmtOffset} />
                            )}
                        </div>
                        {circuitData && isTrack && (
                            <div className="col-span-3 lg:col-span-1 xl:p-5 xl:border-t border-zinc-800">
                                <CircuitMap
                                    circuitData={circuitData}
                                    drivers={driverList!}
                                    positions={position!}
                                    timingDrivers={timingDataF1!}
                                    trackStatus={trackStatus!}
                                    raceControlMessages={raceControlMessages!} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {archiveStatus && trackStatus && (
                <RaceStatus heartbeat={heartbeat} extrapolatedClock={extrapolatedClock} archiveStatus={archiveStatus} trackStatus={trackStatus} lapCount={lapCount} />
            )}
        </div>
    );
};

export default LiveDashboard;
