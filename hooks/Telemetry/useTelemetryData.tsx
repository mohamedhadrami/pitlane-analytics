// @/hooks/useTelemetryData.tsx

import { useEffect, useCallback } from "react";
import { fetchCarData, fetchDrivers, fetchLaps, fetchLocation, fetchMeeting, fetchRaceControl, fetchSession, fetchStint, fetchWeather } from "@/services/openF1Api";
import { DateRangeParams, DriverParams, LapParams, MeetingParams, RaceControlParams, SessionParams, StintParams, WeatherParams } from "@/interfaces/openF1";
import { fetchCircuitByKey } from "@/services/mvApi";
import { delay } from "@/utils/helpers";
import { calculateLapTime } from "@/utils/telemetryUtils";
import { toast } from "sonner";
import { useTelemetry } from "@/context/TelemetryContext";
import { DriverChartData } from "@/interfaces/custom";



export const useFetchYears = () => {
    const { setYears } = useTelemetry();

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const availableYears = Array.from(
            { length: currentYear - 2022 },
            (_, index) => (currentYear - index).toString()
        );
        setYears(availableYears);
    }, []);

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

        if (!selectedYear || !selectedMeetingKey || !selectedSessionKey || !sessions) {
            setSelectedSession(undefined)
            setSelectedLap(null)
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
        } else {
            if (selectedSessionKey) {
                const dataPromise = fetchData();
                toast.promise(Promise.all([dataPromise]), {
                    loading: `Loading session data...`,
                    success: `Session data loaded successfully!`,
                    error: (e: any) => `${e.message}. Make sure the session key is correct`,
                });
            }
        }

    }, [selectedYear, selectedMeetingKey, selectedSessionKey, sessions]);

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
                loading: `Loading lap times for ${driver.name_acronym}...`,
                success: `Lap times for ${driver.name_acronym} loaded successfully!`,
                error: `Error loading lap times for ${driver.name_acronym}`,
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
    return toggleDriverSelect;
};

export const useHandleDriverSelect = () => {
    const { selectedDrivers, setIsShowLapTimes, setIsShowTelemetry } = useTelemetry();

    useEffect(() => {
        if (selectedDrivers.size > 0) setIsShowLapTimes(true);
        setIsShowTelemetry(false)
    }, [selectedDrivers]);
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
            setIsShowLapTimes(false);
            setIsShowTelemetry(true);
        } else {
            setIsShowTelemetry(false);
        }
    }, [fetchTelemetryData, selectedLap]);
};