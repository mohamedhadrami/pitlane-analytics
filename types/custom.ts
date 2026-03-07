// @/interface/custom.ts

import type { JSX } from "react";
import type { OFCarData, OFDriver, OFLap, OFLocation, OFRaceControl, OFStint } from "./openF1.types";


export type DriverChartData = {
    selectedLap: number | null;
    driver: OFDriver;
    laps: OFLap[];
    carData: ExtendedCarData[];
    locationData: OFLocation[];
    stintData: OFStint[];
    raceControl: OFRaceControl[];
    chartData: any[];
}

export interface ExtendedCarData extends OFCarData {
    lap_time?: number;
}

export type NavigationItem = {
    key: string;
    label: string;
    href: string;
    icon: JSX.Element;
    description: string;
    isDisabled: boolean;
}