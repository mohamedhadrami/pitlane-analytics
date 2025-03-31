// @/hooks/Telemetry/useFetchSessionData.tsx

import { useTelemetry } from "@/context/TelemetryContext";
import { fetchCircuitByKey } from "@/services/mvApi";
import { fetchWeather, fetchDrivers, fetchRaceControl, fetchStint, fetchPosition } from "@/services/openF1Api";
import type { DriverChartData } from "@/types/custom";
import type { OFWeatherParams, OFDriverParams, OFRaceControlParams, OFStintParams } from "@/types/openF1.types";
import { delay } from "@/utils/helpers";
import { assertSession } from "@/utils/telemetry/assertTelemetry";
import { useEffect } from "react";
import { toast } from "sonner";

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
        setPositions,
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

            const positionRes = await fetchPosition(params);
            if (!positionRes) throw new Error("Error fetching position data");
            setPositions(positionRes);

            const driverRes = await fetchDrivers(params as OFDriverParams);
            if (!driverRes) throw new Error("Error fetching driver data");
            
            const recentPositions = driverRes.map(driver => {
                const driverPositions = positionRes.filter(position => position.driver_number === driver.driver_number);
                return { driver, position: driverPositions.pop()?.position || 0 };
            });
            const sorted = recentPositions.sort((a, b) => a.position - b.position).map(item => item.driver);
            setDrivers(sorted);
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
        setPositions,
        setDrivers,
        setRaceControl,
        setStints,
        setCircuitData
    ]);

};
