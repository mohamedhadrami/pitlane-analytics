"use client"

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Divider, Image, Accordion, AccordionItem } from "@nextui-org/react";
import { MeetingParams, SessionParams, WeatherParams } from "@/interfaces/openF1";
import { Thermometer, Droplets, ThermometerSun, AirVent, Wind, Milestone, MoveUp, CloudRainWind, Cloudy, CalendarFold } from "lucide-react";
import { calculateWeatherStats } from "@/utils/telemetryUtils";
import { fetchCountryFlagByName } from "@/services/countryApi";
import { parseISODateAndTime, trackImage } from "@/utils/helpers";
import { fetchRaceResultsByCircuit } from "@/services/ergastApi";
import CustomTable from "@/components/tables/CustomTable";
import { RaceHeaders } from "@/utils/const";

interface SessionStatsProps {
    meeting: MeetingParams | undefined,
    session: SessionParams,
    weather: WeatherParams[],
}

const SessionStats: React.FC<SessionStatsProps> = ({
    meeting,
    session,
    weather,
}) => {

    const [weatherAvg, setWeatherAvg] = useState<any>(null);
    const [flag, setFlag] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [results, setResults] = useState<any>();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setWeatherAvg(calculateWeatherStats(weather));
    }, [weather]);

    useEffect(() => {
        const fetchData = async () => {
            const flagApiData = await fetchCountryFlagByName(meeting?.country_name!);
            setFlag(flagApiData);
            //const res = await fetch(`/api/db/tables/results?year=${meeting?.year}&name=${meeting?.meeting_name}`);
            //const data = await res.json();
            //setResults(data.data);
        }
        if (meeting) fetchData();
    }, [meeting])

    const show: boolean = true;

    return (
        <div className="flex justify-center w-full max-w-screen-lg mx-auto">
            {isMobile ?
                <SessionStatsAccordian session={session} meeting={meeting!} flag={flag} weatherAvg={weatherAvg} />
                :
                <SessionStatsCards session={session} meeting={meeting!} flag={flag} weatherAvg={weatherAvg} />
            }
            {results && show && (
                <CustomTable rawData={results} headers={RaceHeaders} type='race2' />
            )}
        </div>
    )
}

export default SessionStats;

const SessionStatsContainer: React.FC<{ session: SessionParams, meeting: MeetingParams }> = ({ session, meeting }) => {
    return (
        <>
            <span className="text-center">{meeting?.meeting_official_name}</span>
            <p>{session.session_name}</p>
            <p>
                Start:{" "}
                {parseISODateAndTime(
                    session.date_start!,
                    session.gmt_offset
                )}
            </p>
            <p>
                End:{" "}
                {parseISODateAndTime(
                    session.date_end!,
                    session.gmt_offset
                )}
            </p>
        </>
    )
}

const CircuitStatsContainer: React.FC<{ flag: any, meeting: MeetingParams }> = ({ flag, meeting }) => {
    return (
        <>
            <p>
                {meeting?.location}, {meeting?.country_name}
            </p>
            <div className="flex justify-center">
                <Image
                    className=""
                    alt="track image"
                    src={trackImage(meeting?.location, meeting?.country_name)}
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

const SessionStatsCards: React.FC<{
    session: SessionParams,
    meeting: MeetingParams,
    flag: any,
    weatherAvg: any
}> = ({
    session,
    meeting,
    flag,
    weatherAvg
}) => {
        return (
            <div className="flex md:flex-row flex-col gap-3 m-5 w-full">
                <Card className="md:w-1/3 md:min-w-0 min-w-full rounded-lg bg-gradient-to-tl from-zinc-800 to-[#111]">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-lg font-light">Session</h1>
                        <CalendarFold />
                    </CardHeader>
                    <Divider />
                    <CardBody className="font-extralight">
                        <SessionStatsContainer session={session!} meeting={meeting!} />
                    </CardBody>
                </Card>
                <Card className="md:w-1/3 md:min-w-0 min-w-full rounded-lg bg-gradient-to-tl from-zinc-800 to-[#111]">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-lg font-light">Circuit</h1>
                        <Image
                            className="rounded-lg"
                            alt="flag image"
                            width={40}
                            src={flag?.png} />
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex flex-col items-center font-extralight">
                        <CircuitStatsContainer flag={flag} meeting={meeting!} />
                    </CardBody>
                </Card>
                <Card className="md:w-1/3 md:min-w-0 min-w-full rounded-lg bg-gradient-to-tl from-zinc-800 to-[#111]">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-lg font-light">Weather</h1>
                        <Cloudy />
                    </CardHeader>
                    <Divider />
                    <CardBody className="font-extralight">
                        <WeatherStatsContainer weatherAvg={weatherAvg} />
                    </CardBody>
                </Card>
            </div>
        )
    }

const SessionStatsAccordian: React.FC<{
    session: SessionParams,
    meeting: MeetingParams,
    flag: any,
    weatherAvg: any
}> = ({
    session,
    meeting,
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
                        key="session" aria-label="Session" title="Session"
                        startContent={<CalendarFold className="mx-2" />}
                        subtitle={`Get information about the ${meeting.meeting_name} ${session.session_name}`}
                    >
                        <SessionStatsContainer session={session!} meeting={meeting!} />
                    </AccordionItem>
                    <AccordionItem
                        key="circuit" aria-label="Circuit" title="Circuit"
                        startContent={<Image
                            className="rounded-lg"
                            alt="flag image"
                            width={40}
                            src={flag?.png} />}
                        subtitle={`Get information about ${meeting.circuit_short_name}`}
                    >
                        <CircuitStatsContainer flag={flag} meeting={meeting!} />
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