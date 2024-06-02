// @/app/telemtry/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CarDataParams, DateRangeParams, DriverParams, LapParams, MeetingParams, RaceControlParams, SessionParams, StintParams, WeatherParams } from "@/interfaces/openF1";
import { fetchCarData, fetchDrivers, fetchLaps, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import { mvCircuit } from "@/interfaces/multiviewer";
import { fetchCircuitByKey } from "@/services/mvApi";
import { DriverChartData } from "@/interfaces/custom";
import { delay } from "@/utils/helpers";
import { calculateLapTime } from "@/utils/telemetryUtils";

import SessionSelector from "@/components/Telemetry/SessionSelector";
import SessionStats from "@/components/Telemetry/SessionStats";
import PitStrategy from "@/components/Telemetry/PitStrategy";
import DriverSelection from "@/components/Telemetry/DriverSelection";
import LapTimesLineChart from "@/components/Telemetry/LapTimesLineChart";
import LapStatsLineChart from "@/components/Telemetry/TelemetryCharts";
import TrackVisualizer from "@/components/Telemetry/TrackVisualizer";
import LapSummary from "@/components/Telemetry/LapSummary";



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
    const [raceControl, setRaceControl] = useState<RaceControlParams[]>([]);
    const [circuitData, setCircuitData] = useState<mvCircuit>();

    const [isShowDriverSelect, setIsShowDriverSelect] = useState<boolean>(false);
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<
        Map<
            string, DriverChartData
        >
    >(new Map());
    const [stints, setStints] = useState<StintParams[]>([]);

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
        const params = {
            meeting_key: selectedMeetingKey,
            session_key: selectedSessionKey
        };
        const fetchWeatherData = async () => {
            const res = await fetchWeather(params as WeatherParams);
            setWeather(res);
            if (res) setIsShowSession(true);
        };
        const fetchDriverData = async () => {
            const res = await fetchDrivers(params as DriverParams);
            setDrivers(res);
            if (res) setIsShowDriverSelect(true);
            await delay(500);
        };
        const fetchRaceControlData = async () => {
            const res = await fetchRaceControl(params as RaceControlParams);
            setRaceControl(res);
        };
        const fetchStintData = async () => {
            const res = await fetchStint(params as StintParams);
            setStints(res);
        }
        const fetchCircuitData = async () => {
            const res = await fetchCircuitByKey(selectedSession?.circuit_key!, selectedYear!);
            setCircuitData(res);
        };
        if (selectedSessionKey) {
            const session = sessions?.find(v => v.session_key === selectedSessionKey);
            setSelectedSession(session);
            fetchWeatherData();
            fetchDriverData();
            fetchRaceControlData();
            fetchStintData();
            fetchCircuitData();
        }
        setSelectedDrivers(new Map());
        setIsShowLapTimes(false);
        setIsShowTelemetry(false);
    }, [selectedYear, selectedMeetingKey, selectedSessionKey, selectedSession, sessions]);




    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
        setIsShowTelemetry(false)
    }, [selectedDrivers]);




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
            const stintData = stints.filter((stint: LapParams) => stint.driver_number === driver.driver_number);

            toast.promise(Promise.all([lapApiPromise]), {
                loading: `Loading data for ${driver.name_acronym}...`,
                success: `Data for ${driver.name_acronym} loaded successfully!`,
                error: `Error loading data for ${driver.name_acronym}`,
            });

            const [lapApiData] = await Promise.all([lapApiPromise]);

            setSelectedDrivers((prevMap) => {
                const updatedMap = new Map(prevMap);
                updatedMap.set(driverKey!, {
                    selectedLap: null,
                    driver,
                    laps: lapApiData,
                    carData: [],
                    locationData: [],
                    stintData: stintData,
                    raceControl: raceControl,
                    chartData: []
                });
                return updatedMap;
            });
        }

        if (selectedDrivers?.size !== 0) setSelectedLap(null);
    };




    const fetchTelemetryData = useCallback(async () => {
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
                const locationApiData = await fetchLocation(params, dateRangeParams);
                return {
                    driver: driverData.driver,
                    carDataWithLapTime,
                    locationData: locationApiData,
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
                        locationData: result?.locationData,
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
            fetchTelemetryData();
            setIsShowTelemetry(true);
        } else {
            setIsShowTelemetry(false);
        }
    }, [fetchTelemetryData, selectedLap]);




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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
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
                            <DriverSelection
                                drivers={drivers}
                                selectedDrivers={selectedDrivers}
                                toggleDriverSelect={toggleDriverSelect}
                            />
                        </motion.div>
                    )}
                </div>
                {isShowDriverSelect && selectedSession && drivers && (
                    <motion.div
                        key="driver-selector"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PitStrategy stints={stints} drivers={drivers} />

                    </motion.div>
                )}
            </div>
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
            {isShowTelemetry && selectedDrivers && selectedLap && circuitData && (
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
                    <TrackVisualizer circuitData={circuitData} driverData={selectedDrivers} />
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

