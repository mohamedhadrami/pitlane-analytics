"use client"

import { useState, useEffect } from "react";
import SessionSelector from "./SessionSelector";
import { DateRangeParams, DriverParams, LapParams, MeetingParams, RaceControlParams, SessionParams, WeatherParams } from "@/interfaces/openF1";
import { fetchCarData, fetchDrivers, fetchLaps, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import SessionStats from "./SessionStats";
import DriverSelection from "./DriverSelection";
import { useSearchParams } from "next/navigation";
import LapTimesLineChart from "@/app/telemetry/LapTimesLineChart";
import { DriverChartData } from "@/interfaces/custom";
import { calculateLapTime } from "@/utils/telemetryUtils";
import LapStatsLineChart from "@/app/telemetry/LapStatsLineChart";
import { toast } from "sonner";


const Page: React.FC = () => {
    const searchParams = useSearchParams();

    const [years, setYears] = useState<string[]>([]);
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
    const [selectedDrivers, setSelectedDrivers] = useState<
        Map<
            string, DriverChartData
        >
    >(new Map());

    const [raceControl, setRaceControl] = useState<RaceControlParams[]>([]);

    const [isShowLapTimes, setIsShowLapTimes] = useState<boolean>(false);
    const [selectedLap, setSelectedLap] = useState<number | null>(null);

    const [isShowTelemetry, setIsShowTelemetry] = useState<boolean>(false);


    useEffect(() => {
        if (searchParams) {
            const queryYear = searchParams.get("year");
            const queryMeeting = searchParams.get("meeting");
            const querySession = searchParams.get("session");
            if (queryYear) setSelectedYear(parseInt(queryYear))
            if (queryMeeting) setSelectedMeetingKey(parseInt(queryMeeting))
            if (querySession) setSelectedSessionKey(parseInt(querySession))
        }
    }, [searchParams])


    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const availableYears = Array.from(
            { length: currentYear - 2017 },
            (_, index) => (currentYear - index).toString()
        );
        setYears(availableYears);
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
    }, [selectedYear, years]);

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
    }, [selectedMeetingKey, meetings]);

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
        const fetchRaceControlData = async () => {
            const params: RaceControlParams = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            }
            const res = await fetchRaceControl(params);
            setRaceControl(res);
        }
        if (selectedSessionKey) {
            const session = sessions?.find(v => v.session_key === selectedSessionKey);
            setSelectedSession(session)
            fetchWeatherData();
            fetchDriverData();
            fetchRaceControlData();
        }
        setSelectedDrivers(new Map())
        setIsShowLapTimes(false);
    }, [selectedSessionKey, sessions]);

    const toggleDriverSelect = async (driver: DriverParams) => {
        const driverKey = driver.driver_number?.toString();
        const isDriverSelected = selectedDrivers?.has(driverKey!);

        if (isDriverSelected) {
            const updatedDrivers = new Map(selectedDrivers);
            updatedDrivers.delete(driverKey!);
            setSelectedDrivers(updatedDrivers);
        } else {
            const params = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey,
                driver_number: driver.driver_number,
            };

            const lapApiPromise = fetchLaps(params);
            const stintApiPromise = fetchStint(params);

            toast.promise(Promise.all([lapApiPromise, stintApiPromise]), {
                loading: `Loading data for ${driver.name_acronym}...`,
                success: `Data for ${driver.name_acronym} loaded successfully!`,
                error: `Error loading data for ${driver.name_acronym}`,
            });

            const [lapApiData, stintApiData] = await Promise.all([lapApiPromise, stintApiPromise]);

            setSelectedDrivers((prevMap) => {
                const updatedMap = new Map(prevMap);
                updatedMap.set(driverKey!, {
                    driver,
                    laps: lapApiData,
                    carData: [],
                    locationData: [],
                    stintData: stintApiData,
                    chartData: []
                });
                return updatedMap;
            });
        }

        if (selectedDrivers?.size !== 0) setSelectedLap(null);
    }

    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
    }, [selectedDrivers]);

    useEffect(() => {
        const fetchData = async () => {
            selectedDrivers.forEach(
                async (driver: DriverChartData) => {
                    const driverData = driver.driver;
                    const lapData = driver.laps;
                    const stintData = driver.stintData;
                    const lap: LapParams = lapData.find((lap: LapParams) => lap.lap_number === selectedLap)!;
                    const params = {
                        meeting_key: selectedMeetingKey,
                        session_key: selectedSessionKey,
                        driver_number: driver.driver.driver_number,
                    };

                    const date_gt: string = lap.date_start!;
                    const lapDurationMilliseconds: number = lap.lap_duration! * 1000;
                    const date_gtObject: Date = new Date(date_gt);
                    const localTimeOffset: number = date_gtObject.getTimezoneOffset();
                    const date_ltObject: Date = new Date(
                        date_gtObject.getTime() +
                        lapDurationMilliseconds -
                        localTimeOffset * 60 * 1000
                    );
                    const date_lt: string = date_ltObject.toISOString();
                    const dateRangeParams: DateRangeParams = {
                        date_gt: date_gt,
                        date_lt: date_lt,
                    };

                    const carApiData = await fetchCarData(params, dateRangeParams);
                    const carDataWithLapTime = calculateLapTime(carApiData);

                    const locationApiData = await fetchLocation(params, dateRangeParams);

                    setSelectedDrivers(
                        (prevMap) =>
                            new Map(
                                prevMap.set(driver.driver.driver_number!.toString(), {
                                    driver: driverData,
                                    laps: lapData,
                                    carData: carDataWithLapTime,
                                    locationData: locationApiData,
                                    stintData: stintData,
                                    chartData: driver.chartData
                                })
                            )
                    );
                }
            );
        }

        if (selectedLap) {
            fetchData();
            setIsShowTelemetry(true);
        }
    }, [selectedLap])

    return (
        <>
            <h1 className="text-3xl font-light py-5 text-center">Telemetry</h1>
            <SessionSelector
                key="session-selector"
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
            {isShowSession && selectedMeeting && selectedSession && weather && (
                <SessionStats
                    key="session-stats"
                    meeting={selectedMeeting}
                    session={selectedSession}
                    weather={weather}
                />
            )}
            {isShowDriverSelect && selectedSession && drivers && (
                <DriverSelection
                    key="driver-selector"
                    drivers={drivers}
                    selectedDrivers={selectedDrivers}
                    toggleDriverSelect={toggleDriverSelect}
                />
            )}
            {isShowLapTimes && selectedDrivers && raceControl && (
                <LapTimesLineChart
                    key="lap-time-chart"
                    driversData={selectedDrivers}
                    raceControl={raceControl}
                    onLapSelect={setSelectedLap} />
            )}
            {isShowTelemetry && selectedDrivers && selectedLap && (
                <LapStatsLineChart
                    key="lap-stats-chart"
                    driversData={selectedDrivers}
                    lapSelected={selectedLap} />
            )}
        </>
    )
}

export default Page;