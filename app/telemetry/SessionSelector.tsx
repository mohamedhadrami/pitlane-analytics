// app/telemetry/SessionSelector.tsx

"use client"

import React from "react";
import Selector from "./Selector";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";

interface SessionSelectorsProps {
    years: string[],
    meetings: MeetingParams[],
    sessions: SessionParams[],
    setSelectedYear: (value: any) => void,
    setSelectedMeetingKey: (value: any) => void,
    setSelectedSessionKey: (value: any) => void,
    selectedYear: string | undefined,
    selectedMeeting: MeetingParams | undefined,
    selectedSession: SessionParams | undefined,
}

const SessionSelector: React.FC<SessionSelectorsProps> = ({
    years,
    meetings,
    sessions,
    setSelectedYear,
    setSelectedMeetingKey,
    setSelectedSessionKey,
    selectedYear,
    selectedMeeting,
    selectedSession
}) => {

    const selections = {
        "year": {
            "values": years,
            "disabled": years.length == 0 ? true : false,
        },
        "meeting": {
            "values": meetings,
            "disabled": meetings.length == 0 ? true : false,
        },
        "session": {
            "values": sessions,
            "disabled": sessions.length == 0 ? true : false,
        }
    }

    const getValue = (label: any) => {
        switch (label) {
            case "year":
                if (!selectedYear) return `Select a year`;
                return selectedYear;
            case "meeting":
                if (!selectedMeeting) return `Select a race`;
                return selectedMeeting?.meeting_name;
            case "session":
                if (!selectedSession) return `Select a session`;
                return selectedSession?.session_name;
            default:
                break;
        }
    }

    const setValue = (value: any, label: any) => {
        switch (label) {
            case "year":
                setSelectedYear(value)
                break;
            case "meeting":
                const meeting = meetings?.find(v => v.meeting_official_name === value);
                setSelectedMeetingKey(meeting?.meeting_key);
                break;
            case "session":
                const session = sessions?.find(v => v.session_name === value);
                setSelectedSessionKey(session?.session_key)
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex justify-center">
            <div className="flex md:flex place-content-between w-full md:w-1/2 space-x-4 px-5 max-w-screen-md">
                {Object.keys(selections).map((key: string) => (
                    <Selector
                        id={key}
                        key={`${key}-dropdown`}
                        label={key}
                        values={selections[key as keyof typeof selections].values}
                        onChange={setValue}
                        displayValue={getValue}
                        disabled={selections[key as keyof typeof selections].disabled}
                    />
                ))}
            </div>
        </div>
    )
}

export default SessionSelector;
