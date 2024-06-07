// @/hooks/useTelemetryData.tsx

import { useState, useEffect, useCallback } from "react";
import { fetchCarData, fetchDrivers, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import { CarDataParams, DateRangeParams, DriverParams, LapParams, MeetingParams, RaceControlParams, SessionParams, StintParams, WeatherParams } from "@/interfaces/openF1";
import { fetchCircuitByKey } from "@/services/mvApi";
import { delay } from "@/utils/helpers";
import { DriverChartData } from "@/interfaces/custom";
import { mvCircuit } from "@/interfaces/multiviewer";
import { calculateLapTime } from "@/utils/telemetryUtils";
import { toast } from "sonner";



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

    useEffect(() => {
        if (!selectedYear) return;

        const fetchData = async () => {
            const params: MeetingParams = { year: selectedYear };
            const fetchedMeetings = await fetchMeeting(params);
            if (fetchedMeetings.length === 0) throw new Error("No meetings fetched. Checked if year is within the correct range")
            setMeetings(fetchedMeetings);
        };

        const dataPromise = fetchData();
        toast.promise(Promise.all([dataPromise]), {
            loading: `Loading meetings...`,
            success: `Meetings loaded successfully!`,
            error: (e: any) => `${e.message}`,
        });

    }, [selectedYear]);

    return { meetings };
};




export const useFetchSessions = (meetings: MeetingParams[], selectedMeetingKey: number | undefined, setSelectedMeeting: (v: any) => void) => {
    const [sessions, setSessions] = useState<SessionParams[]>([]);

    useEffect(() => {
        if (!selectedMeetingKey) return;

        const fetchData = async () => {
            const params: SessionParams = { meeting_key: selectedMeetingKey };
            const fetchedSessions = await fetchSession(params);
            if (fetchedSessions.length === 0) throw new Error("No sessions fetched. Checked if meeting key is correct.")
            setSessions(fetchedSessions);
            const meeting = meetings?.find(v => v.meeting_key === selectedMeetingKey);
            setSelectedMeeting(meeting);
        };

        const dataPromise = fetchData();
        toast.promise(Promise.all([dataPromise]), {
            loading: `Loading sessions...`,
            success: `Sessions loaded successfully!`,
            error: (e: any) => `${e.message}`,
        });
    }, [selectedMeetingKey, meetings]);

    return { sessions };
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

    useEffect(() => {
        const fetchData = async () => {
            const session = sessions?.find(v => v.session_key === selectedSessionKey);
            setSelectedSession(session!);
            const params = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            };

            const weatherRes = await fetchWeather(params as WeatherParams);
            if (!weatherRes) throw new Error("Error fetching weather");
            setWeather(weatherRes);
            setIsShowSession(true);

            const driverRes = await fetchDrivers(params as DriverParams);
            if (!driverRes) throw new Error("Error fetching driver data");
            setDrivers(driverRes);
            await delay(500);
            setIsShowDriverSelect(true);

            const raceControlRes = await fetchRaceControl(params as RaceControlParams);
            if (!raceControlRes) throw new Error("Error fetching race control data");
            setRaceControl(raceControlRes);

            const stintRes = await fetchStint(params as StintParams);
            if (!stintRes) throw new Error("Error fetching stints");
            setStints(stintRes);
            await delay(1000);
            setIsShowPitStrategy(true);

            const circuitRes = await fetchCircuitByKey(session?.circuit_key!, selectedYear!);
            if (!circuitRes) throw new Error("Error fetching circuit data");
            setCircuitData(circuitRes);
            setSelectedDrivers(new Map());
            setIsShowLapTimes(false);
            setIsShowTelemetry(false);
        }

        if (selectedSessionKey) {
            const dataPromise = fetchData();
            toast.promise(Promise.all([dataPromise]), {
                loading: `Loading sessions...`,
                success: `Sessions loaded successfully!`,
                error: (e: any) => `${e.message}. Make sure the session key is correct`,
            });
        }

    }, [selectedYear, selectedMeetingKey, selectedSessionKey, sessions]);

    return { weather, drivers, raceControl, stints, circuitData };
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
                const carApiPromise = fetchCarData(params, dateRangeParams);
                const locationApiPromise = fetchLocation(params, dateRangeParams);
                toast.promise(Promise.all([carApiPromise, locationApiPromise]), {
                    loading: `Loading telemetry for ${driverData.driver.name_acronym}...`,
                    success: `Telemetry for ${driverData.driver.name_acronym} loaded successfully!`,
                    error: `Error loading telemetry for ${driverData.driver.name_acronym}`,
                });

                const [carApiData, locationApiData] = await Promise.all([carApiPromise, locationApiPromise]);

                const carDataWithLapTime = calculateLapTime(carApiData);
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
};