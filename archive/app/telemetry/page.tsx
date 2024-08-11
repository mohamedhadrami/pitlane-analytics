// @/app/telemetry/page.tsx
// Create breadcrumbs instead of dynamically loading

"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DriverParams, LapParams } from "@/interfaces/openF1";
import { fetchLaps } from "@/services/openF1Api";

import SessionSelector from "@/components/Telemetry/SessionSelector";
import SessionStats from "@/components/Telemetry/SessionStats";
import TyreStrategy from "@/components/Telemetry/TyreStrategy";
import DriverSelection from "@/components/Telemetry/DriverSelection";
import LapTimesLineChart from "@/components/Telemetry/LapTimesLineChart";
import LapStatsLineChart from "@/components/Telemetry/TelemetryCharts";
import TrackVisualizer from "@/components/Telemetry/TrackVisualizer";
import LapSummary from "@/components/Telemetry/LapSummary";
import { TelemetryProvider, useTelemetry } from "@/context/TelemetryContext";
import { useFetchMeetings, useFetchSessionData, useFetchSessions, useFetchTelemetryData, useFetchYears, useHandleDriverSelect } from "@/hooks/Telemetry/useTelemetryData";
import { Tab, Tabs } from "@nextui-org/react";


const PageContent: React.FC = () => {

    const {
        //years, setYears,
        //meetings, setMeetings,
        //sessions, setSessions,
        selectedYear, setSelectedYear,
        selectedMeeting, setSelectedMeeting,
        selectedMeetingKey, setSelectedMeetingKey,
        selectedSession, setSelectedSession,
        selectedSessionKey, setSelectedSessionKey,
        isShowSession, setIsShowSession,
        //weather, setWeather,
        //raceControl, setRaceControl,
        //circuitData, setCircuitData,
        isShowDriverSelect, setIsShowDriverSelect,
        //drivers, setDrivers,
        selectedDrivers, setSelectedDrivers,
        isShowPitStrategy, setIsShowPitStrategy,
        //stints, setStints,
        isShowLapTimes, setIsShowLapTimes,
        selectedLap, setSelectedLap,
        isShowTelemetry, setIsShowTelemetry
    } = useTelemetry();


    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams) {
            const queryYear = searchParams.get("year");
            const queryMeeting = searchParams.get("meeting");
            const querySession = searchParams.get("session");
            if (queryYear) setSelectedYear(queryYear);
            if (queryMeeting) setSelectedMeetingKey(parseInt(queryMeeting));
            if (querySession) setSelectedSessionKey(parseInt(querySession));
        }
    }, [searchParams, setSelectedYear, setSelectedMeetingKey, setSelectedSessionKey]);

    const years = useFetchYears();
    const { meetings } = useFetchMeetings(selectedYear);
    const { sessions } = useFetchSessions(meetings, selectedMeetingKey, setSelectedMeeting);
    const { weather, drivers, raceControl, stints, circuitData } = useFetchSessionData(
        selectedYear, selectedMeetingKey, selectedSessionKey, sessions,
        setSelectedSession, setIsShowSession, setIsShowDriverSelect,
        setIsShowPitStrategy, setSelectedDrivers, setIsShowLapTimes, setIsShowTelemetry
    );

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

    useHandleDriverSelect(selectedDrivers, setIsShowLapTimes, setIsShowTelemetry);

    useFetchTelemetryData(
        selectedMeetingKey,
        selectedSessionKey,
        selectedDrivers,
        setSelectedDrivers,
        selectedLap,
        setIsShowTelemetry
    );


    return (
        <div className="p-3">
            <h1 className="text-3xl font-light py-5 text-center">Telemetry</h1>
            <motion.div
                key="session-selector"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-3">
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
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    {isShowSession && selectedMeeting && selectedSession && weather && (
                        <SessionStats meeting={selectedMeeting} session={selectedSession} weather={weather} />
                    )}
                    {isShowPitStrategy && stints && drivers && (
                        <div className="m-5">
                            <Tabs className="" color="primary">
                                <Tab key="tyre-strategy" title="Tyre Strategy" className="">
                                    <TyreStrategy stints={stints} drivers={drivers} />
                                </Tab>
                                <Tab key="results" title="Results" className="">
                                </Tab>
                            </Tabs>
                        </div>
                    )}
                </div>
                <div className="flex flex-col space-y-4 p-3">
                    {isShowDriverSelect && drivers && selectedDrivers && (
                        <DriverSelection
                            drivers={drivers}
                            selectedDrivers={selectedDrivers}
                            toggleDriverSelect={toggleDriverSelect}
                        />
                    )}
                    {isShowLapTimes && selectedDrivers && raceControl && (
                        <LapTimesLineChart
                            driversData={selectedDrivers}
                            raceControl={raceControl}
                            onLapSelect={setSelectedLap}
                        />
                    )}
                </div>
            </div>
            {isShowTelemetry && selectedDrivers && selectedLap && circuitData && (
                <>
                    <LapStatsLineChart driversData={selectedDrivers} lapSelected={selectedLap} />
                    <TrackVisualizer circuitData={circuitData} driverData={selectedDrivers} />
                    <LapSummary driversData={selectedDrivers} lapSelected={selectedLap} />
                </>
            )}
        </div>
    );
};


const Page: React.FC = () => {
    return (
        <TelemetryProvider>
            <PageContent />
        </TelemetryProvider>
    );
};


export default Page;