// @/hooks/Telemetry/useFetchTelemetryData.tsx

import { useTelemetry } from "@/context/TelemetryContext";
import { fetchCarData, fetchLocation } from "@/services/openF1Api";
import type { OFLap, OFDateRangeParams } from "@/types/openF1.types";
import { calculateLapTime } from "@/utils/telemetry/telemetryUtils";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

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