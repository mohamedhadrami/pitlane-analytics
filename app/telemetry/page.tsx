"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SessionSelector from "./SessionSelector";
import { CarDataParams, DateRangeParams, DriverParams, LapParams, MeetingParams, RaceControlParams, SessionParams, WeatherParams } from "@/interfaces/openF1";
import { fetchCarData, fetchDrivers, fetchLaps, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import SessionStats from "./SessionStats";
import DriverSelection from "./DriverSelection";
import { useSearchParams } from "next/navigation";
import LapTimesLineChart from "@/app/telemetry/LapTimesLineChart";
import { DriverChartData } from "@/interfaces/custom";
import { calculateLapTime } from "@/utils/telemetryUtils";
import LapStatsLineChart from "@/app/telemetry/LapStatsLineChart";
import { toast } from "sonner";
import LapSummary from "./LapSummary";

const Page: React.FC = () => {
    const searchParams = useSearchParams();

    const [years, setYears] = useState<string[]>([]);
    const [meetings, setMeetings] = useState<MeetingParams[]>([]);
    const [sessions, setSessions] = useState<SessionParams[]>([]);

    const [selectedYear, setSelectedYear] = useState<string>();
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
            if (queryYear) setSelectedYear(queryYear);
            if (queryMeeting) setSelectedMeetingKey(parseInt(queryMeeting));
            if (querySession) setSelectedSessionKey(parseInt(querySession));
        }
    }, [searchParams]);

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
            };
            const res = await fetchMeeting(params);
            setMeetings(res);
        };
        if (selectedYear) fetchData();
    }, [selectedYear, years]);

    useEffect(() => {
        const fetchData = async () => {
            const params: SessionParams = {
                year: selectedYear,
                meeting_key: selectedMeetingKey
            };
            const res = await fetchSession(params);
            setSessions(res);
        };
        if (selectedMeetingKey) {
            fetchData();
            const meeting = meetings?.find(v => v.meeting_key === selectedMeetingKey);
            setSelectedMeeting(meeting);
        }
    }, [selectedYear, selectedMeetingKey, meetings]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const params: WeatherParams = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            };
            const res = await fetchWeather(params);
            setWeather(res);
            if (res) setIsShowSession(true);
        };
        const fetchDriverData = async () => {
            const params: DriverParams = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            };
            const res = await fetchDrivers(params);
            setDrivers(res);
            if (res) setIsShowDriverSelect(true);
        };
        const fetchRaceControlData = async () => {
            const params: RaceControlParams = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            };
            const res = await fetchRaceControl(params);
            setRaceControl(res);
        };
        if (selectedSessionKey) {
            const session = sessions?.find(v => v.session_key === selectedSessionKey);
            setSelectedSession(session);
            fetchWeatherData();
            fetchDriverData();
            fetchRaceControlData();
        }
        setSelectedDrivers(new Map());
        setIsShowLapTimes(false);
    }, [selectedMeetingKey, selectedSessionKey, sessions]);

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
                    selectedLap: null,
                    driver,
                    laps: lapApiData,
                    carData: [],
                    locationData: [],
                    stintData: stintApiData,
                    raceControl: raceControl,
                    chartData: []
                });
                return updatedMap;
            });
        }

        if (selectedDrivers?.size !== 0) setSelectedLap(null);
    };

    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
    }, [selectedDrivers]);

    
    const fetchData = useCallback(async () => {
        const lapDataRequests = Array.from(selectedDrivers, async ([_, driverData]) => {
            if (driverData.selectedLap !== selectedLap || driverData.carData.length === 0) {
                const lap: LapParams = driverData.laps.find((lap: LapParams) => lap.lap_number === selectedLap)!;
                const date_gt: string = lap.date_start!;
                const lapDurationMilliseconds: number = lap.lap_duration! * 1000;
                const date_gtObject: Date = new Date(date_gt);
                const date_ltObject: Date = new Date(date_gtObject.getTime() + lapDurationMilliseconds);
                const date_lt: string = date_ltObject.toISOString();
                const dateRangeParams: DateRangeParams = {
                    date_gt: date_gt,
                    date_lt: date_lt,
                };
                const params = {
                    meeting_key: selectedMeetingKey,
                    session_key: selectedSessionKey,
                    driver_number: driverData.driver.driver_number,
                };
                const carApiData: CarDataParams[] = await fetchCarData(params, dateRangeParams);
                const carDataWithLapTime = calculateLapTime(carApiData);
                //const locationApiData = await fetchLocation(params, dateRangeParams);
                return {
                    driver: driverData.driver,
                    carDataWithLapTime,
                    //locationData: locationApiData,
                };
            }
            return null;
        });

        const lapDataResults = await Promise.all(lapDataRequests);
        const updatedSelectedDrivers = new Map(selectedDrivers);

        let hasUpdate = false;
        for (const result of lapDataResults) {
            if (result !== null) {
                const driverKey = result?.driver.driver_number!.toString();
                const existingDriverData = updatedSelectedDrivers.get(driverKey!);
                if (existingDriverData) {
                    updatedSelectedDrivers.set(driverKey!, {
                        ...existingDriverData,
                        selectedLap: selectedLap,
                        carData: result?.carDataWithLapTime!,
                        //locationData: result?.locationData,
                    });
                    hasUpdate = true;
                }
            }
        }

        if (hasUpdate) {
            setSelectedDrivers(updatedSelectedDrivers);
        }
    }, [selectedDrivers, selectedLap, selectedMeetingKey, selectedSessionKey]);

    useEffect(() => {
        if (selectedLap) {
            fetchData();
            setIsShowTelemetry(true);
        }
    }, [fetchData, selectedLap]);
    return (
        <>
            <h1 className="text-3xl font-light py-5 text-center">Telemetry</h1>
            <motion.div
                key="session-selector"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
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
            </motion.div>
            {isShowSession && selectedMeeting && selectedSession && weather && (
                <motion.div
                    key="session-stats"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <SessionStats
                        meeting={selectedMeeting}
                        session={selectedSession}
                        weather={weather}
                    />
                </motion.div>
            )}
            {isShowDriverSelect && selectedSession && drivers && (
                <motion.div
                    key="driver-selector"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <DriverSelection
                        drivers={drivers}
                        selectedDrivers={selectedDrivers}
                        toggleDriverSelect={toggleDriverSelect}
                    />
                </motion.div>
            )}
            {isShowLapTimes && selectedDrivers && raceControl && (
                <motion.div
                    key="lap-time-chart"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LapTimesLineChart
                        driversData={selectedDrivers}
                        raceControl={raceControl}
                        onLapSelect={setSelectedLap}
                    />
                </motion.div>
            )}
            {isShowTelemetry && selectedDrivers && selectedLap && (
                <motion.div
                    key="lap-stats-chart"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LapStatsLineChart
                        driversData={selectedDrivers}
                        lapSelected={selectedLap}
                    />
                    <LapSummary
                        driversData={selectedDrivers}
                        lapSelected={selectedLap}
                    />
                </motion.div>
            )}
        </>
    );
};

export default Page;


/**
 * <LapStatsLineChartOld
                        driversData={selectedDrivers}
                        lapSelected={selectedLap}
                    />
 */