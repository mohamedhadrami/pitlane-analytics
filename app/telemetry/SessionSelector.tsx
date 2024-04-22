// app/telemetry/SessionSelector.tsx

"use client"

import React, {useEffect} from "react";
import Selector from "./selector";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { fetchMeeting } from "@/services/openF1Api";

interface SessionSelectorsProps {
    years: number[],
    meetings: MeetingParams[],
    sessions: SessionParams[],
    setSelectedYear: (value: any) => void,
    setSelectedMeeting: (value: any) => void,
    setSelectedSession: (value: any) => void,
    selectedYear: number | undefined,
    selectedMeeting: MeetingParams | undefined,
    selectedSession: SessionParams | undefined,
}

const SessionSelector: React.FC<SessionSelectorsProps> = ({
    years,
    meetings,
    sessions,
    setSelectedYear,
    setSelectedMeeting,
    setSelectedSession,
    selectedYear,
    selectedMeeting,
    selectedSession
}) => {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

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
            "setValue": setSelectedMeeting,
            "disabled": false,//meetings.length == 0 ? true : false,
        },
        "session": {
            "values": sessions,
            "selectedValue": selectedSession,
            "setValue": setSelectedSession,
            "disabled": false,//sessions.length == 0 ? true : false,
        }
    }

    useEffect(() => {
        console.log(`Year selected:`, selectedYear)
    }, [selectedYear])

    useEffect(() => {
        console.log(`Meeting selected: ${selectedMeeting}`)
    }, [selectedMeeting])

    useEffect(() => {
        console.log(`Session selected: ${selectedSession}`)
    }, [selectedSession])

    return (
        <div className="flex justify-center">
            <div className="md:flex place-content-between w-full md:w-1/2 space-x-4 px-5">
                {Object.keys(selections).map((key) => (
                    <Selector
                        id={key}
                        label={key}
                        values={selections[key].values}
                        onChange={selections[key].setValue}
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