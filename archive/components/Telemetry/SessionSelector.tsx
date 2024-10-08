// @/components/Telemetry/SessionSelector.tsx

"use client"

import React from "react";
import Selector from "@/components/Telemetry/Selector";
import { useTelemetry } from "@/context/TelemetryContext";

const SessionSelector: React.FC = () => {

    const {
        years,
        meetings,
        sessions,
        setSelectedYear,
        setSelectedMeetingKey,
        setSelectedSessionKey,
        selectedYear,
        selectedMeeting,
        selectedSession
    } = useTelemetry();

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
                setSelectedMeetingKey(Number(meeting?.meeting_key!));
                break;
            case "session":
                const session = sessions?.find(v => v.session_name === value);
                setSelectedSessionKey(Number(session?.session_key!))
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
