// app/telemetry/SessionSelector.tsx

"use client"

import React, {useEffect} from "react";
import Selector from "./Selector";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";

interface SessionSelectorsProps {
    years: number[],
    meetings: MeetingParams[],
    sessions: SessionParams[],
    setSelectedYear: (value: any) => void,
    setSelectedMeetingKey: (value: any) => void,
    setSelectedSessionKey: (value: any) => void,
    selectedYear: number | undefined,
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
            "selectedValue": selectedYear,
            "setValue": setSelectedYear,
            "disabled": years.length == 0 ? true : false,
        },
        "meeting": {
            "values": meetings,
            "selectedValue": selectedMeeting,
            //"setValue": setSelectedMeeting,
            "disabled": meetings.length == 0 ? true : false,
        },
        "session": {
            "values": sessions,
            "selectedValue": selectedSession,
            //"setValue": setSelectedSession,
            "disabled": sessions.length == 0 ? true : false,
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

    useEffect(() => {
        //console.log(`Year selected:`, selectedYear)
    }, [selectedYear])

    useEffect(() => {
        //console.log(`Meeting selected: ${selectedMeeting}`)
    }, [selectedMeeting])
    
    useEffect(() => {
        console.log(sessions)
    }, [sessions])

    useEffect(() => {
        //console.log(`Session selected: ${selectedSession}`)
    }, [selectedSession])

    return (
        <div className="flex justify-center">
            <div className="md:flex place-content-between w-full md:w-1/2 space-x-4 px-5">
                {Object.keys(selections).map((key) => (
                    <Selector
                        id={key}
                        label={key}
                        values={selections[key].values}
                        onChange={setValue}
                        value={selections[key].selectedValue}
                        disabled={selections[key].disabled}
                    />
                ))}
            </div>
        </div>
    )
}

export default SessionSelector;

/*
                    <Selector 
                        id={""}
                        label={""}
                        values={null}
                        onChange={setSelectedKeys}
                        value={undefined}
                        disabled={false}
                    />
*/