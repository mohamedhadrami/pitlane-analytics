// @/utils/telemetryUtils.ts

import { DriverChartData } from "@/interfaces/custom";
import { CarDataParams, WeatherParams } from "@/interfaces/openF1"

export const calculateWeatherStats = (weatherData: WeatherParams[]) => {
    if (weatherData?.length === 0) return null;

    const airTemperatureAvg =
        weatherData?.reduce((sum, data) => sum + (data.air_temperature || 0), 0) /
        weatherData?.length;
    const humidityAvg =
        weatherData?.reduce((sum, data) => sum + (data.humidity || 0), 0) /
        weatherData?.length;
    const trackTempAvg =
        weatherData?.reduce(
            (sum, data) => sum + (data.track_temperature || 0),
            0
        ) / weatherData?.length;
    const pressureAvg =
        weatherData?.reduce((sum, data) => sum + (data.pressure || 0), 0) /
        weatherData?.length;
    const windSpeedAvg =
        weatherData?.reduce((sum, data) => sum + (data.wind_speed || 0), 0) /
        weatherData?.length;
    const windDirectionAvg =
        weatherData?.reduce((sum, data) => sum + (data.wind_direction || 0), 0) /
        weatherData?.length;

    const rainingEntries = weatherData?.filter((data) => data.rainfall === 1);
    const rainAvg = rainingEntries?.length > 0 ? 1 : 0;

    return {
        airTemperatureAvg,
        humidityAvg,
        trackTempAvg,
        pressureAvg,
        windSpeedAvg,
        windDirectionAvg,
        rainAvg,
    };
};


export const calculateLapTime = (carApiData: CarDataParams[]): CarDataParams[] => {
    if (carApiData.length === 0) {
        return [];
    }

    const firstTimestamp = new Date(carApiData[0].date!).getTime();

    const carDataWithLapTime = carApiData.map((carData) => {
        const currentTimestamp = new Date(carData.date!).getTime();
        const lapTimeSeconds = (currentTimestamp - firstTimestamp) / 1000;

        return {
            ...carData,
            lap_time: lapTimeSeconds,
        };
    });

    return carDataWithLapTime;
};

export const getWindDirection = (angle: number | undefined) => {
    if (!angle) return null;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    const index = Math.round(angle / 45);
    return directions[index];
};

export const calculateAverages = (driversData: Map<string, DriverChartData>) => {
    const averages: Record<string, { speed: number, throttle: number, brake: number, driver_name: string }> = {};

    const sums: Record<string, Record<string, number>> = {};
    const counts: Record<string, Record<string, number>> = {};

    Array.from(driversData.values()).forEach((driverData) => {
        const acronym = driverData.driver.name_acronym;
        if (acronym) {
            sums[acronym] = {
                speed: 0,
                throttle: 0,
                brake: 0,
            };
            counts[acronym] = {
                speed: 0,
                throttle: 0,
                brake: 0,
            };
        }
    });

    Array.from(driversData.values()).forEach((driverData) => {
        const acronym = driverData.driver.name_acronym;
        if (acronym) {
            driverData.carData.forEach((carDatum) => {
                sums[acronym].speed += carDatum.speed!;
                counts[acronym].speed++;

                sums[acronym].throttle += carDatum.throttle!;
                counts[acronym].throttle++;

                sums[acronym].brake += carDatum.brake!;
                counts[acronym].brake++;
            });
        }
    });

    Array.from(driversData.values()).forEach((driverData) => {
        const acronym = driverData.driver.name_acronym;
        if (acronym) {
            averages[acronym] = {
                speed: sums[acronym].speed / counts[acronym].speed,
                throttle: sums[acronym].throttle / counts[acronym].throttle,
                brake: sums[acronym].brake / counts[acronym].brake,
                driver_name: driverData.driver.full_name!,
            };
        }
    });

    return averages;
};
