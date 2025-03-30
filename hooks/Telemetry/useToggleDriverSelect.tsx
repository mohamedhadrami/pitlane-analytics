// @/hooks/Telemetry/useToggleDriverSelect.tsx

import { useTelemetry } from "@/context/TelemetryContext";
import { fetchLaps } from "@/services/openF1Api";
import type { OFDriver, OFStint } from "@/types/openF1.types";
import { toast } from "sonner";

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