// @/components/Telemetry/TelemetryStepManager.tsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/TelemetryContext";
import SelectionPrompt from "./SelectionPrompt";
import Dash1 from "./Dash1";
import DriverSelection from "./DriverSelection";
import LapTimesLineChart from "./LapTimesLineChart";
import { Calendar } from "lucide-react";
import TelemetryCharts from "./TelemetryCharts";

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
        isShowTelemetry
    } = useTelemetry();

    const [currentStep, setCurrentStep] = useState<string>("driver-lap");

    const getCurrentStep = () => {
        if (!selectedYear) return "year";
        if (!selectedMeeting) return "meeting";
        if (!selectedSession) return "session";
        if (!selectedDrivers.size) return "stats-drivers";
        if (isShowLapTimes) return "driver-lap";
        if (isShowTelemetry) return "lap-telemetry";
        return "year";
    };

    useEffect(() => {
        setCurrentStep(getCurrentStep())
    }, [selectedYear,
        selectedMeeting,
        selectedSession,
        selectedDrivers,
        isShowLapTimes,
        isShowTelemetry,])

    const handleNextStep = () => {
        if (currentStep === "driver-lap") {
            setCurrentStep("lap-telemetry");
        } else if (currentStep === "lap-telemetry") {
            setCurrentStep("telemetry-fullscreen");
        }
    };

    const renderLeftComponent = () => {
        switch (currentStep) {
            case "driver-lap":
                return <DriverSelection />;
            case "lap-telemetry":
                console.log("its on")
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
                return <SelectionPrompt label="Session" icon={<Calendar size={50} />} data={sessions}/>;
            case "stats-drivers":
                return <Dash1 />;
            case "driver-lap":
            case "lap-telemetry":
                return (
                    <div className="flex flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep + "-left"}
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
                                key={currentStep + "-right"}
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
