// @/hooks/useTelemetryData.tsx

import { useEffect, useCallback } from "react";
import { fetchCarData, fetchDrivers, fetchLaps, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import type { OFDateRangeParams, OFDriver, OFDriverParams, OFLap, OFMeetingParams, OFRaceControlParams, OFSession, OFSessionParams, OFStint, OFStintParams, OFWeatherParams } from "@/types/openF1.types";
import { fetchCircuitByKey } from "@/services/mvApi";
import { delay } from "@/utils/helpers";
import { calculateLapTime } from "@/utils/telemetry/telemetryUtils";
import { toast } from "sonner";
import { useTelemetry } from "@/context/TelemetryContext";
import type { DriverChartData } from "@/types/custom";
import { assertSession } from "../../utils/telemetry/assertTelemetry";



export const useFetchYears = () => {
    const { setYears } = useTelemetry();

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const availableYears = Array.from(
            { length: currentYear - 2022 },
            (_, index) => (currentYear - index).toString()
        );
        setYears(availableYears);
    }, [setYears]);

};



export const useFetchMeetings = () => {
    const { selectedYear, setMeetings, setSelectedMeetingKey } = useTelemetry();

    useEffect(() => {
        if (!selectedYear) {
            setMeetings([]);
            setSelectedMeetingKey(undefined);
            return;
        }

        const fetchData = async () => {
            const params: OFMeetingParams = { year: selectedYear };
            const fetchedMeetings = await fetchMeeting(params);
            if (fetchedMeetings.length === 0) throw new Error("No meetings fetched. Checked if year is within the correct range")
            setMeetings(fetchedMeetings);
        };

        const dataPromise = fetchData();
        toast.promise(Promise.all([dataPromise]), {
            loading: "Loading meetings...",
            success: "Meetings loaded successfully!",
            error: (e: Error) => `${e.message}`,
        });

    }, [selectedYear, setMeetings, setSelectedMeetingKey]);

};




export const useFetchSessions = () => {
    const {
        meetings,
        selectedMeetingKey,
        setSelectedMeeting,
        setSessions,
        setSelectedSessionKey
    } = useTelemetry();

    useEffect(() => {
        if (!selectedMeetingKey || !meetings) {
            setSelectedMeeting(undefined);
            setSessions([]);
            setSelectedSessionKey(undefined);
            return;
        }

        const fetchData = async () => {
            const params: OFSessionParams = { meeting_key: selectedMeetingKey };
            const fetchedSessions = await fetchSession(params);
            if (fetchedSessions.length === 0) throw new Error("No sessions fetched. Checked if meeting key is correct.")
            setSessions(fetchedSessions);
            const meeting = meetings?.find(v => v.meeting_key === selectedMeetingKey);
            setSelectedMeeting(meeting);
        };

        const dataPromise = fetchData();
        toast.promise(Promise.all([dataPromise]), {
            loading: "Loading sessions...",
            success: "Sessions loaded successfully!",
            error: (e: Error) => `${e.message}`,
        });
    }, [selectedMeetingKey, meetings, setSessions, setSelectedMeeting, setSelectedSessionKey]);

};


export const useFetchSessionData = () => {
    const {
        selectedYear,
        selectedMeetingKey,
        selectedSessionKey,
        sessions,
        setSelectedSession,
        setSelectedLap,
        setIsShowSession,
        setIsShowDriverSelect,
        setIsShowPitStrategy,
        setSelectedDrivers,
        setIsShowLapTimes,
        setIsShowTelemetry,

        setWeather,
        setDrivers,
        setRaceControl,
        setStints,
        setCircuitData,
    } = useTelemetry()

    useEffect(() => {


        const fetchData = async () => {
            if (!selectedYear) {
                throw new Error("Session not found");
            }
            const session = sessions?.find(v => v.session_key === selectedSessionKey);
            assertSession(session);
            setSelectedSession(session);
            const params = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey
            };

            const weatherRes = await fetchWeather(params as OFWeatherParams);
            if (!weatherRes) throw new Error("Error fetching weather");
            setWeather(weatherRes);
            setIsShowSession(true);

            const driverRes = await fetchDrivers(params as OFDriverParams);
            if (!driverRes) throw new Error("Error fetching driver data");
            setDrivers(driverRes);
            await delay(500);
            setIsShowDriverSelect(true);

            const raceControlRes = await fetchRaceControl(params as OFRaceControlParams);
            if (!raceControlRes) throw new Error("Error fetching race control data");
            setRaceControl(raceControlRes);

            const stintRes = await fetchStint(params as OFStintParams);
            if (!stintRes) throw new Error("Error fetching stints");
            setStints(stintRes);
            await delay(1000);
            setIsShowPitStrategy(true);

            const circuitRes = await fetchCircuitByKey(session.circuit_key, selectedYear);
            if (!circuitRes) throw new Error("Error fetching circuit data");
            setCircuitData(circuitRes);
            setSelectedDrivers(new Map());
            setIsShowLapTimes(false);
            setIsShowTelemetry(false);
        }

        if (!selectedYear || !selectedMeetingKey || !selectedSessionKey || !sessions) {
            setSelectedSession(undefined)
            setSelectedLap(undefined)
            setIsShowSession(false)
            setIsShowDriverSelect(false)
            setIsShowPitStrategy(false)
            setSelectedDrivers(new Map<string, DriverChartData>)
            setIsShowLapTimes(false)
            setIsShowTelemetry(false)
            setWeather([])
            setDrivers([])
            setRaceControl([])
            setStints([])
            setCircuitData(undefined)
            return;
        }
        if (selectedSessionKey) {
            const dataPromise = fetchData();
            toast.promise(Promise.all([dataPromise]), {
                loading: "Loading session data...",
                success: "Session data loaded successfully!",
                error: (e: Error) => `${e.message}. Make sure the session key is correct`,
            });
        }

    }, [selectedYear,
        selectedMeetingKey,
        selectedSessionKey,
        sessions,
        setSelectedSession,
        setSelectedLap,
        setIsShowSession,
        setIsShowDriverSelect,
        setIsShowPitStrategy,
        setSelectedDrivers,
        setIsShowLapTimes,
        setIsShowTelemetry,
        setWeather,
        setDrivers,
        setRaceControl,
        setStints,
        setCircuitData
    ]);

};


export const useToggleDriverSelect = () => {
    const {
        selectedMeetingKey,
        selectedSessionKey,
        raceControl,
        selectedDrivers,
        setSelectedDrivers,
        stints,
        setSelectedLap,
    } = useTelemetry();

    const toggleDriverSelect = async (driver: OFDriver) => {
        const driverKey = driver.driver_number?.toString();
        const isDriverSelected = selectedDrivers?.has(driverKey);

        if (isDriverSelected) {
            const updatedDrivers = new Map(selectedDrivers);
            updatedDrivers.delete(driverKey);
            setSelectedDrivers(updatedDrivers);
        } else {
            const params = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey,
                driver_number: driver.driver_number,
            };

            const lapApiPromise = fetchLaps(params);
            const stintData = stints.filter((stint: OFStint) => stint.driver_number === driver.driver_number);

            toast.promise(Promise.all([lapApiPromise]), {
                loading: `Loading lap times for ${driver.name_acronym}...`,
                success: `Lap times for ${driver.name_acronym} loaded successfully!`,
                error: `Error loading lap times for ${driver.name_acronym}`,
            });

            const [lapApiData] = await Promise.all([lapApiPromise]);

            setSelectedDrivers((prevMap) => {
                const updatedMap = new Map(prevMap);
                updatedMap.set(driverKey, {
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

        if (selectedDrivers?.size !== 0) setSelectedLap(undefined);
    };
    return toggleDriverSelect;
};

export const useHandleDriverSelect = () => {
    const { selectedDrivers, setIsShowLapTimes, setIsShowTelemetry } = useTelemetry();

    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
        setIsShowTelemetry(false)
    }, [selectedDrivers, setIsShowLapTimes, setIsShowTelemetry]);
};



export const useFetchTelemetryData = () => {

    const {
        selectedMeetingKey,
        selectedSessionKey,
        selectedDrivers,
        setSelectedDrivers,
        selectedLap,
        setIsShowLapTimes,
        setIsShowTelemetry,
    } = useTelemetry();

    const fetchTelemetryData = useCallback(async () => {
        const lapDataRequests = Array.from(selectedDrivers, async ([_, driverData]) => {
            if (driverData.selectedLap !== selectedLap || driverData.carData.length === 0) {
                const lap = driverData.laps.find((lap: OFLap) => lap.lap_number === selectedLap);

                if (!lap) {
                    console.warn(`Lap ${selectedLap} not found for driver ${driverData.driver.name_acronym}`);
                    return null;
                }

                const date_gt: string = lap.date_start;
                const lapDurationMilliseconds: number = lap.lap_duration * 1000;
                const date_gtObject: Date = new Date(date_gt);
                const date_ltObject: Date = new Date(date_gtObject.getTime() + lapDurationMilliseconds);
                const date_lt: string = date_ltObject.toISOString();
                const dateRangeParams: OFDateRangeParams = {
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
            if (result !== null && result !== undefined) {
                const driverKey = result.driver.driver_number.toString();
                const existingDriverData = updatedSelectedDrivers.get(driverKey);
                if (existingDriverData) {
                    updatedSelectedDrivers.set(driverKey, {
                        ...existingDriverData,
                        selectedLap: selectedLap!,
                        carData: result?.carDataWithLapTime,
                        locationData: result?.locationData,
                    });
                    hasUpdate = true;
                }
            }
        }

        if (hasUpdate) {
            setSelectedDrivers(updatedSelectedDrivers);
        }
    }, [selectedDrivers, selectedLap, selectedMeetingKey, selectedSessionKey, setSelectedDrivers]);

    useEffect(() => {
        if (selectedLap) {
            fetchTelemetryData();
            setIsShowLapTimes(false);
            setIsShowTelemetry(true);
        } else {
            setIsShowTelemetry(false);
        }
    }, [fetchTelemetryData, setIsShowLapTimes, setIsShowTelemetry, selectedLap]);
};