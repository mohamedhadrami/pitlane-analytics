import { CarDataParams, DriverParams, LapParams, LocationParams, RaceControlParams, StintParams } from "./openF1";


export interface DriverChartData {
    selectedLap: number | null;
    driver: DriverParams;
    laps: LapParams[];
    carData: ExtendedCarDataParams[];
    locationData: LocationParams[];
    stintData: StintParams[];
    raceControl: RaceControlParams[];
    chartData: any[];
}

export interface ExtendedCarDataParams extends CarDataParams {
    lap_time?: number;
}