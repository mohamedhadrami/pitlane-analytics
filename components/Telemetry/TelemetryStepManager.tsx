// @/components/Telemetry/TelemetryStepManager.tsx

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/TelemetryContext";
import SelectionPrompt from "./SelectionPrompt";
import DriverSelection from "./DriverSelection";
import LapTimesLineChart from "./LapTimes/LapTimesLineChart";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import TelemetryCharts from "./TelemetryCharts/TelemetryCharts";
import { Divider } from "@heroui/react";
import StatsDriverView from "./Views/StatsDriversView";
import { useHandleCurrentStage } from "@/hooks/Telemetry/useTelemetryUI";
import { TelemetryStage, useTelemetryUI } from "@/context/TelemetryUIContext";

const TelemetryStepManager: React.FC = () => {
    const {
        years,
        meetings,
        sessions,
    } = useTelemetry();

    const { currentStage } = useTelemetryUI();
    useHandleCurrentStage();

    const renderLeftComponent = () => {
        switch (currentStage) {
            case TelemetryStage.DriverLap:
                return <DriverSelection />;
            case TelemetryStage.LapTelemetry:
                return <LapTimesLineChart />;
            default:
                return null;
        }
    };

    const renderRightComponent = () => {
        switch (currentStage) {
            case TelemetryStage.DriverLap:
                return <LapTimesLineChart />;
            case TelemetryStage.LapTelemetry:
                return <TelemetryCharts />;
            default:
                return null;
        }
    };

    const renderContent = () => {
        switch (currentStage) {
            case TelemetryStage.Year:
                return <SelectionPrompt label="Year" icon={<CalendarDays size={50} />} data={years} />;
            case TelemetryStage.Meeting:
                return <SelectionPrompt label="Meeting" icon={<MapPin size={50} />} data={meetings} />;
            case TelemetryStage.Session:
                return <SelectionPrompt label="Session" icon={<Timer size={50} />} data={sessions}/>;
            case TelemetryStage.StatsDrivers:
            case TelemetryStage.DriverLap:
                return <StatsDriverView />;
            case TelemetryStage.LapTelemetry:
                return (
                    <div className="flex flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentStage}-left`}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="w-1/2"
                            >
                                {renderLeftComponent()}
                            </motion.div>
                        </AnimatePresence>
                        <Divider orientation="vertical" className="h-full" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentStage}-right`}
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
