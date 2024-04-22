"use client"

import { useState, useEffect } from "react";
import SessionSelector from "./SessionSelector";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { fetchMeeting, fetchSession } from "@/services/openF1Api";


const Page: React.FC = () => {
    const [years, setYears] = useState<number[]>([]);
    const [meetings, setMeetings] = useState<MeetingParams[]>([]);
    const [sessions, setSessions] = useState<SessionParams[]>([]);

    const [selectedYear, setSelectedYear] = useState<number>();
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingParams>();
    const [selectedMeetingKey, setSelectedMeetingKey] = useState<number>();
    const [selectedSession, setSelectedSession] = useState<SessionParams>();
    const [selectedSessionKey, setSelectedSessionKey] = useState<number>();


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

    }, [selectedSession]);

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
        </>
    )
}

export default Page;