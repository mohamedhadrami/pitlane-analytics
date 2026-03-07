// @/components/Telemetry/TelemetryStepManager.tsx

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import SelectionPrompt from "./SelectionPrompt";
import DriverSelection from "./DriverSelection";
import LapTimesLineChart from "./LapTimes/LapTimesLineChart";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import TelemetryCharts from "./TelemetryCharts/TelemetryCharts";
import { Divider } from "@heroui/react";
import StatsDriverView from "./Views/StatsDriversView";
import { useHandleCurrentStage } from "@/hooks/Telemetry/useTelemetryUI";
import { TelemetryStage, useTelemetryUI } from "@/context/Telemetry/TelemetryUIContext";

const TelemetryStepManager: React.FC = () => {
    const {
        years,
        meetings,
        sessions,
    } = useTelemetry();

    const { currentStage, direction } = useTelemetryUI();
    useHandleCurrentStage();

    const commonTransition = { duration: 0.5, ease: "easeInOut" };

    const [initialX, setInitialX] = useState<number>();
    const [exitX, setExitX] = useState<number>();

    useEffect(() => {
        const getAnimationValues = () => {
            if (direction === 'next') {
                setInitialX(300)
                setExitX(-300)
            } else {
                setInitialX(-300)
                setExitX(300)
            }
        };

        getAnimationValues();
    }, [direction])

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
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStage}
                            initial={{ x: initialX, y: 0, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            exit={{ x: exitX, y: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex items-center justify-center w-full"
                        >
                            <SelectionPrompt label="Year" icon={<CalendarDays size={50} />} data={years} />
                        </motion.div>
                    </AnimatePresence>
                )
            case TelemetryStage.Meeting:
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStage}
                            initial={{ x: initialX, y: 0, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            exit={{ x: exitX, y: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex items-center justify-center w-full"
                        >
                            <SelectionPrompt label="Meeting" icon={<MapPin size={50} />} data={meetings} />
                        </motion.div>
                    </AnimatePresence>
                )
            case TelemetryStage.Session:
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStage}
                            initial={{ x: initialX, y: 0, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            exit={{ x: exitX, y: 0, opacity: 0 }}
                            transition={commonTransition}
                            className="flex items-center justify-center w-full"
                        >
                            <SelectionPrompt label="Session" icon={<Timer size={50} />} data={sessions} />
                        </motion.div>
                    </AnimatePresence>
                )
            case TelemetryStage.StatsDrivers:
            case TelemetryStage.DriverLap:
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStage}
                            initial={{ opacity: 0, x: initialX }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: exitX }}
                            transition={commonTransition}
                            className="flex flex-row flex-grow overflow-hidden"
                        >
                            <StatsDriverView />
                        </motion.div>
                    </AnimatePresence>
                );
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
            case TelemetryStage.Telemetry:
                return <TelemetryCharts />;
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
