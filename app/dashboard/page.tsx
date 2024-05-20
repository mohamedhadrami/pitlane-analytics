// @/app/dashboard/page.tsx
"use client"

import React, { useEffect, useState } from "react";
import { DriverParams, MeetingParams, RaceControlParams, SessionParams, StintParams, TeamRadioParams, WeatherParams, LapParams, PositionParams, IntervalParams } from "../../interfaces/openF1";
import { fetchDrivers, fetchIntervals, fetchLaps, fetchMeeting, fetchPosition, fetchRaceControl, fetchSession, fetchStint, fetchTeamRadio, fetchWeather } from "../../services/openF1Api";
import { Grid } from "@mui/material";
import TopBanner from "./TopBanner";
import LiveTiming from "./LiveTiming";
import RaceControl from "./RaceControl";
import TeamRadios from "./TeamRadio";

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

    const meeting_test = "latest"; //1234;
    const session_test = "latest"; //9507;

    const params = {
        meeting_key: meeting_test,
        session_key: session_test
    }

    const fetchMeetingData = async () => {
        const meetingParams: MeetingParams = {meeting_key: meeting_test}
        const data = await fetchMeeting(meetingParams);
        setMeeting(data[0]);
    }

    const fetchSessionData = async () => {
        const data = await fetchSession(params);
        setSession(data[0]);
    }

    const fetchDriverData = async () => {
        const data = await fetchDrivers(params);
        setDrivers(data);
    }

    const fetchRaceControlData = async () => {
        const data = await fetchRaceControl(params);
        setRaceControl(data);
    }

    async function fetchTeamRadioData() {
        const data = await fetchTeamRadio(params);
        setTeamRadio(data);
    }

    async function fetchData() {
        const weatherData = await fetchWeather(params);
        setWeather(weatherData.pop());
        const stintData = await fetchStint(params);
        setStints(stintData);
        const lapData = await fetchLaps(params);
        setLaps(lapData);
        const intervalData = await fetchIntervals(params);
        setIntervals(intervalData);
        const positionData = await fetchPosition(params);
        setPositions(positionData);
    }

    useEffect(() => {
        fetchMeetingData();
        fetchSessionData();
        fetchDriverData();
        fetchRaceControlData();
        fetchTeamRadioData();
        fetchData();
    }, [])

    const isBanner: boolean = true;
    const isLive: boolean = true;
    const isRace: boolean = true;
    const isRadio: boolean = true;

    return (
        <>
            <Grid container spacing={0}>
                {meeting && session && weather && isBanner && (
                    <Grid item xs={12}><TopBanner meeting={meeting} session={session} weather={weather} /></Grid>
                )}
                {drivers && stints && laps && positions && isLive && (
                    <Grid item xs={12} className="m-3"><LiveTiming drivers={drivers} stints={stints} laps={laps} positions={positions} intervals={intervals} /></Grid>
                )}
                {raceControl && isRace && (
                    <Grid item xs><RaceControl drivers={drivers} raceControl={raceControl} /></Grid>
                )}
                {teamRadio && isRadio && (
                    <Grid item xs>
                        <TeamRadios drivers={drivers} teamRadio={teamRadio} />
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default Dashboard;
