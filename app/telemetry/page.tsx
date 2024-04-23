"use client"

import { useState, useEffect } from "react";
import SessionSelector from "./SessionSelector";
import { DriverParams, MeetingParams, SessionParams, WeatherParams } from "@/interfaces/openF1";
import { fetchDrivers, fetchMeeting, fetchSession, fetchWeather } from "@/services/openF1Api";
import SessionStats from "./SessionStats";
import DriverSelection from "./DriverSelection";


const Page: React.FC = () => {
    const [years, setYears] = useState<number[]>([]);
    const [meetings, setMeetings] = useState<MeetingParams[]>([]);
    const [sessions, setSessions] = useState<SessionParams[]>([]);

    const [selectedYear, setSelectedYear] = useState<number>();
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingParams>();
    const [selectedMeetingKey, setSelectedMeetingKey] = useState<number>();
    const [selectedSession, setSelectedSession] = useState<SessionParams>();
    const [selectedSessionKey, setSelectedSessionKey] = useState<number>();

    const [isShowSession, setIsShowSession] = useState<boolean>(false);
    const [weather, setWeather] = useState<WeatherParams[]>([]);

    const [isShowDriverSelect, setIsShowDriverSelect] = useState<boolean>(false);
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<DriverParams[]>([])


    // TODO: change this
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const endYear = 2023;
        const yearArray: number[] = [];
        for (let year = currentYear; year >= endYear; year--) {
            yearArray.push(year);
        }
        setYears(yearArray);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const params: MeetingParams = {
                year: selectedYear
            }
            const res = await fetchMeeting(params);
            setMeetings(res);
        }
        if (selectedYear) fetchData();
    }, [selectedYear]);

    useEffect(() => {
        const fetchData = async () => {
            const params: SessionParams = {
                year: selectedYear,
                meeting_key: selectedMeetingKey
            }
            const res = await fetchSession(params);
            setSessions(res);
        }
        if (selectedMeetingKey) {
            fetchData();
            const meeting = meetings?.find(v => v.meeting_key === selectedMeetingKey);
            setSelectedMeeting(meeting)
        }
    }, [selectedMeetingKey]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const params: WeatherParams = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            }
            const res = await fetchWeather(params);
            setWeather(res);
            if (res) setIsShowSession(true);
        }
        const fetchDriverData = async () => {
            const params: DriverParams = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            }
            const res = await fetchDrivers(params);
            setDrivers(res);
            if (res) setIsShowDriverSelect(true);
        }
        if (selectedSessionKey) {
            const session = sessions?.find(v => v.session_key === selectedSessionKey);
            setSelectedSession(session)
            fetchWeatherData();
            fetchDriverData();
        }
    }, [selectedSessionKey]);

    const toggleDriverSelect = (driver: DriverParams) => {
        let updatedDrivers = selectedDrivers;
        if (selectedDrivers.includes(driver)) {
            updatedDrivers.splice(selectedDrivers.indexOf(driver), 1);
        } else {
            updatedDrivers.push(driver);
        }
        setSelectedDrivers(updatedDrivers);
    }

    return (
        <>
            <h1 className="text-3xl font-light py-5 text-center">Telemetry</h1>
            <SessionSelector
                years={years}
                meetings={meetings}
                sessions={sessions}
                setSelectedYear={setSelectedYear}
                setSelectedMeetingKey={setSelectedMeetingKey}
                setSelectedSessionKey={setSelectedSessionKey}
                selectedYear={selectedYear}
                selectedMeeting={selectedMeeting}
                selectedSession={selectedSession}
            />
            {isShowSession && selectedSession && weather && (
                <SessionStats
                    meeting={selectedMeeting}
                    session={selectedSession}
                    weather={weather} />
            )}
            {isShowDriverSelect && selectedSession && drivers && (
                <DriverSelection
                    drivers={drivers}
                    selectedDrivers={selectedDrivers}
                    toggleDriverSelect={toggleDriverSelect} />
            )}
        </>
    )
}

export default Page;