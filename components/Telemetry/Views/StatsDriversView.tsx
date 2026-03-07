// @/components/Telemetry/Views/StatsDriverView.tsx

<<<<<<< HEAD
import { Card, CardBody, Divider, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
=======
import { Divider } from "@heroui/react";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
import SessionStats from "../SessionStats";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import DriverSelection from "../DriverSelection";
import TyreStrategy from "../TyreStrategy";
<<<<<<< HEAD

const StatsDriverView: React.FC = () => {
    const { isShowDriverSelect, drivers, selectedDrivers } = useTelemetry();

    return (
        <div className="flex flex-row w-full max-h-full">
            <div className="w-1/4 border-r border-default/50">
                {isShowDriverSelect && drivers && selectedDrivers && (
                    <div className="h-full">
                        <DriverSelection />
                    </div>
                )}
            </div>
            <div className="flex-grow h-full">
                <Dash11 />
=======
import LapTimesLineChart from "../LapTimes/LapTimesLineChart";
import { TelemetryStep } from "@/utils/telemetry/telemetrySteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LifeBuoy, Trophy } from "lucide-react";


const StatsDriverView: React.FC = () => {

    const {
        isShowDriverSelect,
        drivers,
        selectedDrivers,
        currentStep
    } = useTelemetry();

    return (
        <div className="flex flex-row flex-grow overflow-hidden">
            <div className="w-1/4 overflow-y-auto border-r border-default/50">
                {isShowDriverSelect && drivers && selectedDrivers && (
                    <DriverSelection />
                )}
            </div>
            <div className="flex-grow  border-default/50 overflow-y-auto">
                {currentStep === TelemetryStep.StatsDrivers ? (
                    <Dash11 />
                ) : (
                    <Dash12 />
                )}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
            </div>
        </div>
    );
};

export default StatsDriverView;

const Dash11: React.FC = () => {
    const {
        selectedMeeting,
        selectedSession,
        isShowSession,
        weather,
        drivers,
        isShowPitStrategy,
        stints,
    } = useTelemetry();

    return (
<<<<<<< HEAD
        <div className="flex flex-col">
            <div className="h-1/2">
=======
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Top Section */}
            <div className="flex-shrink-0">
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                {isShowSession && selectedMeeting && selectedSession && weather && (
                    <SessionStats />
                )}
            </div>
<<<<<<< HEAD
            <Divider />
            <div className="h-1/2 overflow-hidden">
                <ScrollShadow hideScrollBar className="h-full">
                    {isShowPitStrategy && stints && drivers && (
                        <div className="h-full">
                            <Tabs className="h-full" color="primary">
                                <Tab key="tyre-strategy" title="Tyre Strategy" className="h-full">
                                    <TyreStrategy stints={stints} drivers={drivers} />
                                </Tab>
                                <Tab key="results" title="Results" className="h-full">
                                    {/* Content for Results */}
                                </Tab>
                            </Tabs>
                        </div>
                    )}
                </ScrollShadow>
=======

            <Divider />

            {/* Bottom Section: Tabs */}
            <div className="flex-1 overflow-hidden">
                {isShowPitStrategy && stints && drivers && (
                    <Tabs defaultValue="tyre-strategy" className="flex flex-col h-full">
                        <TabsList>
                            <TabsTrigger value="tyre-strategy" className="gap-2"><LifeBuoy />Tyre Strategy</TabsTrigger>
                            <TabsTrigger value="results" className="gap-2"><Trophy />Results</TabsTrigger>
                        </TabsList>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">
                            <TabsContent value="tyre-strategy" className="p-4">
                                <TyreStrategy stints={stints} drivers={drivers} />
                            </TabsContent>
                            <TabsContent value="results" className="p-4">
                                {/* Results content here */}
                            </TabsContent>
                        </div>
                    </Tabs>
                )}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
            </div>
        </div>
    );
};
<<<<<<< HEAD
=======


const Dash12: React.FC = () => {
    const {
        raceControl,
        selectedDrivers,
        isShowLapTimes,
    } = useTelemetry();

    return (
        <>
            {isShowLapTimes && selectedDrivers && raceControl && (
                <LapTimesLineChart />
            )}
        </>
    )
}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
