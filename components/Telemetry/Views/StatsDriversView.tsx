// @/components/Telemetry/Views/StatsDriverView.tsx

import { Card, CardBody, Divider, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import SessionStats from "../SessionStats";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import DriverSelection from "../DriverSelection";
import TyreStrategy from "../TyreStrategy";

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
        <div className="flex flex-col">
            <div className="h-1/2">
                {isShowSession && selectedMeeting && selectedSession && weather && (
                    <SessionStats />
                )}
            </div>
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
            </div>
        </div>
    );
};
