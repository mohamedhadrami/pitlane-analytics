// utils/telemetryUtils.ts

import { CarDataParams, DriverParams, LapParams, LocationParams, WeatherParams } from "../../pitlane-analytics/interfaces/openF1ics-old/interfaces/openF1";

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

    const firstTimestamp = new Date(carApiData[0].date).getTime();

    const carDataWithLapTime = carApiData.map((carData) => {
        const currentTimestamp = new Date(carData.date).getTime();
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

export const calculateAverages = (driversData: Map<
    string,
    {
        driver: DriverParams;
        laps: LapParams[];
        carData: CarDataParams[];
        locationData: LocationParams[];
        raceControl: any[];
        chartData: any[];
    }
>) => {
    const averages = {};

    // Initialize variables to store sum and count for each parameter for each driver
    const sums = {};
    const counts = {};

    // Initialize sums and counts for each parameter for each driver
    Array.from(driversData.values()).forEach((driverData) => {
        sums[driverData.driver.name_acronym] = {
            speed: 0,
            throttle: 0,
            brake: 0,
        };
        counts[driverData.driver.name_acronym] = {
            speed: 0,
            throttle: 0,
            brake: 0,
        };
    });

    // Iterate through driversData to calculate sums and counts
    Array.from(driversData.values()).forEach((driverData) => {
        driverData.carData.forEach((carDatum) => {
            sums[driverData.driver.name_acronym].speed += carDatum.speed;
            counts[driverData.driver.name_acronym].speed++;

            sums[driverData.driver.name_acronym].throttle += carDatum.throttle;
            counts[driverData.driver.name_acronym].throttle++;

            sums[driverData.driver.name_acronym].brake += carDatum.brake;
            counts[driverData.driver.name_acronym].brake++;
        });
    });

    // Calculate averages for each driver
    Array.from(driversData.values()).forEach((driverData) => {
        averages[driverData.driver.name_acronym] = {
            speed: sums[driverData.driver.name_acronym].speed / counts[driverData.driver.name_acronym].speed,
            throttle: sums[driverData.driver.name_acronym].throttle / counts[driverData.driver.name_acronym].throttle,
            brake: sums[driverData.driver.name_acronym].brake / counts[driverData.driver.name_acronym].brake,
            driver_name: driverData.driver.full_name,
        };
    });

    return averages;
};
