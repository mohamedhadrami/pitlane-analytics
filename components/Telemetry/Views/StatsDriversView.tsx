// @/components/Telemetry/Views/StatsDriverView.tsx

import { Divider } from "@heroui/react";
import SessionStats from "../SessionStats";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import DriverSelection from "../DriverSelection";
import TyreStrategy from "../TyreStrategy";
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
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Top Section */}
            <div className="flex-shrink-0">
                {isShowSession && selectedMeeting && selectedSession && weather && (
                    <SessionStats />
                )}
            </div>

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
            </div>
        </div>
    );
};


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