// @/hooks/useTelemetryData.tsx

import { useState, useEffect, useCallback } from "react";
import { fetchCarData, fetchDrivers, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import { CarDataParams, DateRangeParams, DriverParams, LapParams, MeetingParams, RaceControlParams, SessionParams, StintParams, WeatherParams } from "@/interfaces/openF1";
import { fetchCircuitByKey } from "@/services/mvApi";
import { delay } from "@/utils/helpers";
import { DriverChartData } from "@/interfaces/custom";
import { mvCircuit } from "@/interfaces/multiviewer";
import { calculateLapTime } from "@/utils/telemetryUtils";



export const useFetchYears = () => {
    const [years, setYears] = useState<string[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const availableYears = Array.from(
            { length: currentYear - 2022 },
            (_, index) => (currentYear - index).toString()
        );
        setYears(availableYears);
    }, []);

    return years;
};



export const useFetchMeetings = (selectedYear: string | undefined) => {
    const [meetings, setMeetings] = useState<MeetingParams[]>([]);
    const [loadingMeetings, setLoading] = useState<boolean>(false);
    const [errorMeetings, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedYear) return;

        const fetchData = async () => {
            setLoading(true);
            const params: MeetingParams = { year: selectedYear };
            try {
                const fetchedMeetings = await fetchMeeting(params);
                setMeetings(fetchedMeetings);
            } catch (err) {
                setError("Failed to fetch meetings");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear]);

    return { meetings, loadingMeetings, errorMeetings };
};




export const useFetchSessions = (meetings: MeetingParams[], selectedMeetingKey: number | undefined, setSelectedMeeting: (v: any) => void) => {
    const [sessions, setSessions] = useState<SessionParams[]>([]);
    const [loadingSessions, setLoading] = useState<boolean>(false);
    const [errorSessions, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedMeetingKey) return;

        const fetchData = async () => {
            setLoading(true);
            const params: SessionParams = { meeting_key: selectedMeetingKey };
            try {
                const fetchedSessions = await fetchSession(params);
                setSessions(fetchedSessions);
                const meeting = meetings?.find(v => v.meeting_key === selectedMeetingKey);
                setSelectedMeeting(meeting);
            } catch (err) {
                setError("Failed to fetch sessions");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMeetingKey, meetings]);

    return { sessions, loadingSessions, errorSessions };
};




export const useFetchSessionData = (
    selectedYear: string | undefined,
    selectedMeetingKey: number | undefined,
    selectedSessionKey: number | undefined,
    sessions: SessionParams[],
    setSelectedSession: (v: SessionParams) => void,
    setIsShowSession: (v: boolean) => void,
    setIsShowDriverSelect: (v: boolean) => void,
    setIsShowPitStrategy: (v: boolean) => void,
    setSelectedDrivers: (v: Map<string, DriverChartData>) => void,
    setIsShowLapTimes: (v: boolean) => void,
    setIsShowTelemetry: (v: boolean) => void
) => {
    const [weather, setWeather] = useState<WeatherParams[]>([]);
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [raceControl, setRaceControl] = useState<[]>([]);
    const [stints, setStints] = useState<[]>([]);
    const [circuitData, setCircuitData] = useState<mvCircuit>();
    const [loadingSessionData, setLoading] = useState<boolean>(false);
    const [errorSessionData, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const session = sessions?.find(v => v.session_key === selectedSessionKey);
                setSelectedSession(session!);
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
                    await delay(500);
                };
                const fetchRaceControlData = async () => {
                    const res = await fetchRaceControl(params as RaceControlParams);
                    setRaceControl(res);
                };
                const fetchStintData = async () => {
                    const res = await fetchStint(params as StintParams);
                    setStints(res);
                    await delay(1000);
                }
                const fetchCircuitData = async () => {
                    const res = await fetchCircuitByKey(session?.circuit_key!, selectedYear!);
                    setCircuitData(res);
                };
                if (selectedSessionKey) {
                    fetchStintData();
                    fetchWeatherData();
                    fetchDriverData();
                    fetchRaceControlData();
                    fetchCircuitData();
                }
                setSelectedDrivers(new Map());
                setIsShowLapTimes(false);
                setIsShowTelemetry(false);
                setIsShowDriverSelect(true);
                setIsShowPitStrategy(true);
            } catch (err) {
                setError("Failed to fetch session data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [selectedYear, selectedMeetingKey, selectedSessionKey, sessions]);

    return { weather, drivers, raceControl, stints, circuitData, loadingSessionData, errorSessionData };
};




export const useHandleDriverSelect = (selectedDrivers: Map<string, DriverChartData>, setIsShowLapTimes: (v: boolean) => void, setIsShowTelemetry: (v: boolean) => void) => {
    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
        setIsShowTelemetry(false)
    }, [selectedDrivers]);
};



export const useFetchTelemetryData = (
    selectedMeetingKey: number | undefined, 
    selectedSessionKey: number | undefined, 
    selectedDrivers: Map<string, DriverChartData>, 
    setSelectedDrivers: (v: Map<string, DriverChartData>) => void,
    selectedLap: number | null, 
    setIsShowTelemetry: (v: boolean) => void
) => {
    const [loadingTelemetry, setLoading] = useState<boolean>(false);
    const [errorTelemetry, setError] = useState<string | null>(null);

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
        try {
            if (selectedLap) {
                fetchTelemetryData();
                setIsShowTelemetry(true);
            } else {
                setIsShowTelemetry(false);
            }
        } catch (err) {
            setError("Failed to fetch telemetry data");
        } finally {
            setLoading(false);
        }
    }, [fetchTelemetryData, selectedLap]);

    return { loadingTelemetry, errorTelemetry };
};