// @/interface/custom.ts

import type { OFCarDataParams, OFDriverParams, OFLapParams, OFLocationParams, OFRaceControlParams, OFStintParams } from "./openF1.types";


export interface DriverChartData {
    selectedLap: number | null;
    driver: OFDriverParams;
    laps: OFLapParams[];
    carData: ExtendedCarDataParams[];
    locationData: OFLocationParams[];
    stintData: OFStintParams[];
    raceControl: OFRaceControlParams[];
    chartData: any[];
}

export interface ExtendedCarDataParams extends OFCarDataParams {
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