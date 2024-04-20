// pages/dashboard.tsx
"use client"

import React, { useEffect, useState } from "react";
import { DriverParams, MeetingParams, RaceControlParams, SessionParams, StintParams, TeamRadioParams, WeatherParams, LapParams } from "../../interfaces/openF1";
import { fetchDrivers, fetchLaps, fetchMeeting, fetchPosition, fetchRaceControl, fetchSession, fetchStint, fetchTeamRadio, fetchWeather } from "../../services/openF1Api";
import { Grid } from "@mui/material";
import TopBanner from "../../components/Dashboard/TopBanner";
import LiveTiming from "../../components/Dashboard/LiveTiming";
import RaceControl from "../../components/Dashboard/RaceControl";
import TeamRadios from "../../components/Dashboard/TeamRadio";

const Dashboard: React.FC = () => {
    const [meeting, setMeeting] = useState<MeetingParams>();
    const [session, setSession] = useState<SessionParams>();
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [raceControl, setRaceControl] = useState<RaceControlParams[]>([]);
    const [teamRadio, setTeamRadio] = useState<TeamRadioParams[]>([]);
    const [weather, setWeather] = useState<WeatherParams>();
    const [stints, setStints] = useState<StintParams[]>([]);
    const [laps, setLaps] = useState<LapParams[]>([]);

    const meeting_test = 1219;
    const session_test = 9165;

    const fetchMeetingData = async () => {
        const params = {
            meeting_key: meeting_test
        }
        const data = await fetchMeeting(params);
        setMeeting(data[0]);
    }

    const fetchSessionData = async () => {
        const params = {
            meeting_key: meeting_test,
            session_key: session_test
        }
        const data = await fetchSession(params);
        setSession(data[0]);
    }

    const fetchDriverData = async () => {
        const params = {
            meeting_key: meeting_test,
            session_key: session_test
        }
        const data = await fetchDrivers(params);
        setDrivers(data);
    }

    const fetchRaceControlData = async () => {
        const params = {
            meeting_key: meeting_test,
            session_key: session_test
        }
        const data = await fetchRaceControl(params);
        setRaceControl(data);
    }

    const fetchTeamRadioData = async () => {
        const params = {
            meeting_key: meeting_test,
            session_key: session_test
        }
        const data = await fetchTeamRadio(params);
        setTeamRadio(data);
    }

    const fetchData = async () => {
        const params = {
            meeting_key: meeting_test,
            session_key: session_test
        }
        const weatherData = await fetchWeather(params);
        setWeather(weatherData.pop());
        const stintData = await fetchStint(params);
        setStints(stintData);
        const lapData = await fetchLaps(params);
        setLaps(lapData);
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
    const isLive: boolean = false;
    const isRace: boolean = true;
    const isRadio: boolean = true;

    return (
        <>
            <Grid container spacing={0}>
                {meeting && session && weather && isBanner && (
                    <Grid item xs={12}><TopBanner meeting={meeting} session={session} weather={weather} /></Grid>
                )}
                {drivers && stints && laps && isLive && (
                    <Grid item xs={12}><LiveTiming drivers={drivers} stints={stints} laps={laps} /></Grid>
                )}
                {raceControl && isRace && (
                    <Grid item xs><RaceControl drivers={drivers} raceControl={raceControl} /></Grid>
                )}
                {teamRadio && isRadio && (
                    <Grid item xs>
                        <div style={{border: "1px white solid", height: "50vh", overflowY: "scroll", scrollbarWidth: "none"}}>
                            <TeamRadios drivers={drivers} teamRadio={teamRadio} />
                        </div>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default Dashboard;
