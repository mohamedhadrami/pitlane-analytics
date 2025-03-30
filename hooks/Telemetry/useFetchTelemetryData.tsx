// @/hooks/Telemetry/useFetchTelemetryData.tsx

import { useTelemetry } from "@/context/TelemetryContext";
import { fetchCarData, fetchLocation } from "@/services/openF1Api";
import { useCallback, useEffect } from "react";
import { calculateLapTime } from "@/utils/telemetry/telemetryUtils";
import { toast } from "sonner";
import type { OFDateRangeParams } from "@/types/openF1.types";

export const useFetchTelemetryData = () => {
    const {
        selectedMeetingKey,
        selectedSessionKey,
        selectedDrivers,
        setSelectedDrivers,
        selectedLap,
        setIsShowLapTimes,
        setIsShowTelemetry,
        goToNextStep
    } = useTelemetry();

    const fetchTelemetryData = useCallback(async () => {
        if (!selectedLap || selectedDrivers.size === 0) return;

        toast("Fetching telemetry data...");

        const updatedSelectedDrivers = new Map(selectedDrivers);
        let hasUpdate = false;

        for (const [_, driverData] of selectedDrivers) {
            const driverKey = driverData.driver.driver_number.toString();

            // Skip if data already exists for this lap
            if (driverData.selectedLap === selectedLap && driverData.carData.length > 0) continue;

            const lap = driverData.laps.find((l) => l.lap_number === selectedLap);
            if (!lap) continue;

            const date_gt = lap.date_start;
            const lapMs = lap.lap_duration * 1000;
            const date_lt = new Date(new Date(date_gt).getTime() + lapMs).toISOString();
            const range: OFDateRangeParams = { date_gt, date_lt };

            const params = {
                meeting_key: selectedMeetingKey,
                session_key: selectedSessionKey,
                driver_number: driverData.driver.driver_number,
            };

            try {
                const [carData, locationData] = await Promise.all([
                    fetchCarData(params, range),
                    fetchLocation(params, range),
                ]);
                const carDataWithLapTime = calculateLapTime(carData);

                updatedSelectedDrivers.set(driverKey, {
                    ...driverData,
                    selectedLap,
                    carData: carDataWithLapTime,
                    locationData,
                });

                hasUpdate = true;
            } catch (e) {
                toast.error(`Error loading telemetry for ${driverData.driver.name_acronym}`);
            }
        }

        if (hasUpdate) {
            setSelectedDrivers(updatedSelectedDrivers);
            toast.success("Telemetry loaded");
        }

        setIsShowLapTimes(false);
        setIsShowTelemetry(true);
        goToNextStep();
    }, [selectedLap, selectedDrivers, selectedMeetingKey, selectedSessionKey, setSelectedDrivers, goToNextStep, setIsShowLapTimes, setIsShowTelemetry]);
    
    useEffect(() => {
        if (selectedLap && selectedDrivers.size > 0) {
            fetchTelemetryData();
        } else {
            setIsShowTelemetry(false);
        }
    }, [fetchTelemetryData, setIsShowTelemetry, selectedLap, selectedDrivers]);
      
};
