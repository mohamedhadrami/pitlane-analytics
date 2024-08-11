// @/components/Telemetry2/SessionStats.tsx

"use client"

import React, { useEffect, useState } from "react";
import { Image, Accordion, AccordionItem } from "@nextui-org/react";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { Thermometer, Droplets, ThermometerSun, AirVent, Wind, Milestone, MoveUp, CloudRainWind, Cloudy, CalendarFold } from "lucide-react";
import { calculateWeatherStats } from "@/utils/telemetryUtils";
import { fetchCountryFlagByName } from "@/services/countryApi";
import { parseISODateAndTime, trackDetailedImage } from "@/utils/helpers";
import CustomTable from "@/components/tables/CustomTable";
import { RaceHeaders } from "@/utils/const";
import { useTelemetry } from "@/context/TelemetryContext";

const SessionStats: React.FC = () => {

    const {
        selectedMeeting,
        selectedSession,
        weather,
    } = useTelemetry();

    const [weatherAvg, setWeatherAvg] = useState<any>(null);
    const [flag, setFlag] = useState<any>(null);
    const [results, setResults] = useState<any>();

    useEffect(() => {
        setWeatherAvg(calculateWeatherStats(weather));
    }, [weather]);

    useEffect(() => {
        const fetchData = async () => {
            const flagApiData = await fetchCountryFlagByName(selectedMeeting?.country_name!);
            setFlag(flagApiData);
            //const res = await fetch(`/api/db/tables/results?year=${selectedMeeting?.year}&name=${selectedMeeting?.selectedMeeting_name}`);
            //const data = await res.json();
            //setResults(data.data);
        }
        if (selectedMeeting) fetchData();
    }, [selectedMeeting])

    const show: boolean = true;

    return (
        <div className="flex justify-center w-full max-w-screen-lg mx-auto">
            <SessionStatsAccordian selectedSession={selectedSession!} selectedMeeting={selectedMeeting!} flag={flag} weatherAvg={weatherAvg} />

            {results && show && (
                <CustomTable rawData={results} headers={RaceHeaders} type='race2' />
            )}
        </div>
    )
}

export default SessionStats;

const SessionStatsContainer: React.FC<{ selectedSession: SessionParams, selectedMeeting: MeetingParams }> = ({ selectedSession, selectedMeeting }) => {
    return (
        <>
            <span className="text-center">{selectedMeeting?.meeting_official_name}</span>
            <p>{selectedSession.session_name}</p>
            <p>
                Start:{" "}
                {parseISODateAndTime(
                    selectedSession.date_start!,
                    selectedSession.gmt_offset
                )}
            </p>
            <p>
                End:{" "}
                {parseISODateAndTime(
                    selectedSession.date_end!,
                    selectedSession.gmt_offset
                )}
            </p>
        </>
    )
}

const CircuitStatsContainer: React.FC<{ flag: any, selectedMeeting: MeetingParams }> = ({ flag, selectedMeeting }) => {
    return (
        <>
            <p>
                {selectedMeeting?.location}, {selectedMeeting?.country_name}
            </p>
            <div className="flex justify-center">
                <Image
                    className=""
                    alt="track image"
                    src={trackDetailedImage(selectedMeeting?.location, selectedMeeting?.country_name)}
                />
            </div>
        </>
    )
}

const WeatherStatsContainer: React.FC<{ weatherAvg: any }> = ({ weatherAvg }) => {
    return (
        <div className="flex">
            <div className="flex-col">
                <Thermometer className="inline-block h-4" />    Temperature <br />
                <Droplets className="inline-block h-4" />       Humidity <br />
                <ThermometerSun className="inline-block h-4" /> Track Temp <br />
                <AirVent className="inline-block h-4" />        Pressure <br />
                <Wind className="inline-block h-4" />           Wind Speed <br />
                <Milestone className="inline-block h-4" />      Wind Direction <br />
                <CloudRainWind className="inline-block h-4" />  Rain
            </div>
            <div className="flex-col ml-auto text-right">
                {weatherAvg?.airTemperatureAvg.toFixed(2)} °C <br />
                {weatherAvg?.humidityAvg.toFixed(2)}% <br />
                {weatherAvg?.trackTempAvg.toFixed(2)} °C <br />
                {weatherAvg?.pressureAvg.toFixed(2)} mbar <br />
                {weatherAvg?.windSpeedAvg.toFixed(2)} m/s <br />
                <span style={{ display: "inline-block" }}>
                    <MoveUp
                        style={{
                            transform: `rotate(${weatherAvg?.windDirectionAvg}deg)`,
                        }}
                    />
                </span>{" "}
                <br />
                {weatherAvg?.rainAvg ? "It rained" : "No rain"}
            </div>
        </div>
    )
}


const SessionStatsAccordian: React.FC<{
    selectedSession: SessionParams,
    selectedMeeting: MeetingParams,
    flag: any,
    weatherAvg: any
}> = ({
    selectedSession,
    selectedMeeting,
    flag,
    weatherAvg
}) => {
        return (
            <div className="flex md:flex-row flex-col gap-3 m-5 w-full">
                <Accordion
                    variant="splitted"
                    motionProps={{
                        variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                height: "auto",
                                transition: {
                                    height: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        duration: 1,
                                    },
                                    opacity: {
                                        easings: "ease",
                                        duration: 1,
                                    },
                                },
                            },
                            exit: {
                                y: -10,
                                opacity: 0,
                                height: 0,
                                transition: {
                                    height: {
                                        easings: "ease",
                                        duration: 0.25,
                                    },
                                    opacity: {
                                        easings: "ease",
                                        duration: 0.3,
                                    },
                                },
                            },
                        },
                    }}
                >
                    <AccordionItem
                        key="selectedSession" aria-label="Session" title="Session"
                        startContent={<CalendarFold className="mx-2" />}
                        subtitle={`Get information about the ${selectedMeeting.meeting_name} ${selectedSession.session_name}`}
                    >
                        <SessionStatsContainer selectedSession={selectedSession!} selectedMeeting={selectedMeeting!} />
                    </AccordionItem>
                    <AccordionItem
                        key="circuit" aria-label="Circuit" title="Circuit"
                        startContent={<Image
                            className="rounded-lg"
                            alt="flag image"
                            width={40}
                            src={flag?.png} />}
                        subtitle={`Get information about ${selectedMeeting.circuit_short_name}`}
                    >
                        <CircuitStatsContainer flag={flag} selectedMeeting={selectedMeeting!} />
                    </AccordionItem>
                    <AccordionItem
                        key="weather" aria-label="Weather" title="Weather"
                        startContent={<Cloudy className="mx-2" />}
                        subtitle="See the average weather conditions during the session"
                    >
                        <WeatherStatsContainer weatherAvg={weatherAvg} />
                    </AccordionItem>
                </Accordion>
            </div>
        )
    }