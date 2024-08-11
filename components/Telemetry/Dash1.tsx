

import { Divider, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import SessionStats from "./SessionStats";
import { useTelemetry } from "@/context/TelemetryContext";
import DriverSelection from "./DriverSelection";
import TyreStrategy from "./TyreStrategy";
import LapTimesLineChart from "../Telemetry/LapTimesLineChart";


const Dash1: React.FC = () => {

    const {
        isShowDriverSelect,
        drivers,
        selectedDrivers,
    } = useTelemetry();

    return (
        <>
            <div className="w-1/4 border-r border-default/50">
                {isShowDriverSelect && drivers && selectedDrivers && (
                    <div className="">
                        <DriverSelection />
                    </div>
                )}
            </div>
            <div className="flex-grow h-full">
                <Dash11 />
            </div>
        </>
    )
}

export default Dash1;


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
        <>
            <div className="min-h-1/2 flex flex-grow">
                {isShowSession && selectedMeeting && selectedSession && weather && (
                    <SessionStats />
                )}
            </div>
            <Divider />
            <div className="h-1/2">
                <ScrollShadow hideScrollBar className="">
                    {isShowPitStrategy && stints && drivers && (
                        <div className="">
                            <Tabs className="" color="primary">
                                <Tab key="tyre-strategy" title="Tyre Strategy" className="">
                                    <TyreStrategy stints={stints} drivers={drivers} />
                                </Tab>
                                <Tab key="results" title="Results" className="">
                                </Tab>
                            </Tabs>
                        </div>
                    )}
                </ScrollShadow>
            </div>
        </>
    )
}

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