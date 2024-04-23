"use client"

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { MeetingParams, SessionParams, WeatherParams } from "@/interfaces/openF1";
import { Thermometer, Droplets, ThermometerSun, AirVent, Wind, Milestone, MoveUp, CloudRainWind, Cloudy, CalendarFold } from "lucide-react";
import { calculateWeatherStats } from "@/utils/telemetryUtils";
import { fetchCountryFlagByName } from "@/services/countryApi";
import { parseISODateAndTime, trackImage } from "@/utils/helpers";

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

    useEffect(() => {
        setWeatherAvg(calculateWeatherStats(weather));
    }, [weather]);

    useEffect(() => {
        const fetchData = async () => {
            const flagApiData = await fetchCountryFlagByName(meeting?.country_name);
            setFlag(flagApiData);
        }
        if (meeting) fetchData();
    }, [meeting])


    return (
        <div className="flex justify-center w-full">
            <div className="flex md:flex-row flex-col gap-3 m-5 w-full">
                <Card className="md:w-1/3 md:min-w-0 min-w-full rounded-lg">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-lg font-light">Session</h1>
                        <CalendarFold />
                    </CardHeader>
                    <Divider />
                    <CardBody className="font-extralight">
                        <span className="text-center">{meeting?.meeting_official_name}</span>
                        <p>{session.session_name}</p>
                        <p>
                            Start:{" "}
                            {parseISODateAndTime(
                                session?.date_start,
                                session?.gmt_offset
                            )}
                        </p>
                        <p>
                            End:{" "}
                            {parseISODateAndTime(
                                session?.date_end,
                                session?.gmt_offset
                            )}
                        </p>
                    </CardBody>
                </Card>
                <Card className="md:w-1/3 md:min-w-0 min-w-full rounded-lg">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-lg font-light">Circuit</h1>
                        <Image
                            className="rounded-lg"
                            width={40}
                            src={flag?.png} />
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex flex-col items-center font-extralight">
                        <p>
                            {meeting.location}, {meeting.country_name}
                        </p>
                        <div className="flex justify-center">
                            <Image
                                className=""
                                src={trackImage(meeting.location, meeting.country_name)}
                            />
                        </div>
                    </CardBody>
                </Card>
                <Card className="md:w-1/3 md:min-w-0 min-w-full rounded-lg">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-lg font-light">Weather</h1>
                        <Cloudy />
                    </CardHeader>
                    <Divider />
                    <CardBody className="font-extralight">
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
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default SessionStats;