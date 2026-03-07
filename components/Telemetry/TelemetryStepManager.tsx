// @/components/Telemetry/TelemetryStepManager.tsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import SelectionPrompt from "./SelectionPrompt";
import DriverSelection from "./DriverSelection";
import LapTimesLineChart from "./LapTimes/LapTimesLineChart";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import TelemetryCharts from "./TelemetryCharts/TelemetryCharts";
import { Divider } from "@nextui-org/react";
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
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStage}
                            initial={{ opacity: 0, x: initialX }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: exitX }}
                            transition={commonTransition}
                            className="flex items-center justify-center w-full max-h-full"
                        >
                            <StatsDriverView />
                        </motion.div>
                    </AnimatePresence>
                );
            case TelemetryStage.DriverLap:
            case TelemetryStage.LapTelemetry:
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStage}
                            initial={{ opacity: 0, x: initialX }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: exitX }}
                            transition={commonTransition}
                            className="flex flex-grow"
                        >
                            <AnimatePresence mode="wait">
                                {renderLeftComponent()}
                            </AnimatePresence>
                            <Divider orientation="vertical" className="h-full" />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStage + "-right"}
                                    initial={{ opacity: 0, y: exitX }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: initialX }}
                                    transition={commonTransition}
                                    className="w-full"
                                >
                                    {renderRightComponent()}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>
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
