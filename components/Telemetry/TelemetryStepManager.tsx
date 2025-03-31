// @/components/Telemetry/TelemetryStepManager.tsx

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/TelemetryContext";
import SelectionPrompt from "./SelectionPrompt";
import Dash1 from "./Dash1";
import DriverSelection from "./DriverSelection";
import LapTimesLineChart from "./LapTimesLineChart";
import { Calendar } from "lucide-react";
import TelemetryCharts from "./TelemetryCharts";
import { TelemetryStep } from "@/utils/telemetry/telemetrySteps";

const TelemetryStepManager: React.FC = () => {
    const {
        years,
        meetings,
        sessions,
        selectedYear,
        selectedMeeting,
        selectedSession,
        selectedDrivers,
        selectedLap,
        isShowLapTimes,
        isShowTelemetry,
        currentStep,
        setCurrentStep
    } = useTelemetry();

    const getCurrentStep = () => {
        if (!selectedYear) return TelemetryStep.Year;
        if (!selectedMeeting) return TelemetryStep.Meeting;
        if (!selectedSession) return TelemetryStep.Session;
        if (!selectedDrivers.size) return TelemetryStep.StatsDrivers;
        if (isShowLapTimes) return TelemetryStep.DriverLap;
        if (isShowTelemetry) return TelemetryStep.LapTelemetry;
        return TelemetryStep.Year;
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: Needs to rerender anytime a change happens to the dependencies
    useEffect(() => {
        setCurrentStep(getCurrentStep())
    }, [selectedYear,
        selectedMeeting,
        selectedSession,
        selectedDrivers,
        isShowLapTimes,
        isShowTelemetry])

    const renderLeftComponent = () => {
        switch (currentStep) {
            case "driver-lap":
                return <DriverSelection />;
            case "lap-telemetry":
                return <LapTimesLineChart />;
            default:
                return null;
        }
    };

    const renderRightComponent = () => {
        switch (currentStep) {
            case "driver-lap":
                return <LapTimesLineChart />;
            case "lap-telemetry":
                return <TelemetryCharts />;
            default:
                return null;
        }
    };

    const renderContent = () => {
        switch (currentStep) {
            case "year":
                return <SelectionPrompt label="Year" icon={<Calendar size={50} />} data={years} />;
            case "meeting":
                return <SelectionPrompt label="Meeting" icon={<Calendar size={50} />} data={meetings} />;
            case "session":
                return <SelectionPrompt label="Session" icon={<Calendar size={50} />} data={sessions} />;
            case "stats-drivers":
            case "driver-lap":
                return <Dash1 />;
            case "lap-telemetry":
                return (
                    <div className="flex flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentStep}-left`}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 0.5 }}
                                className="w-1/2"
                            >
                                {renderLeftComponent()}
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentStep}-right`}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="w-1/2"
                            >
                                {renderRightComponent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-grow">
            {renderContent()}
        </div>
    );
};

export default TelemetryStepManager;
