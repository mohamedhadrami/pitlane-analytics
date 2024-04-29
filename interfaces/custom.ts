import { CarDataParams, DriverParams, LapParams, LocationParams, StintParams } from "./openF1";


export interface DriverChartData {
    driver: DriverParams;
    laps: LapParams[];
    carData: ExtendedCarDataParams[];
    locationData: LocationParams[];
    stintData: StintParams[];
    chartData: any[];
}

export interface ExtendedCarDataParams extends CarDataParams {
    lap_time: number;
}