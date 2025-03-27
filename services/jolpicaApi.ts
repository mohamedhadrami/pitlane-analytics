// services/jolpicaApi.ts

import type {
    JLPConstructorDetailsResponse,
    JLPConstructorStandingsResponse,
    JLPDriverDetailsResponse,
    JLPDriverStandingsResponse,
    JLPRaceResultsByCircuitResponse,
    JLPRaceResultsByConstructorResponse,
    JLPRaceResultsByDriverResponse,
    JLPRaceResultsResponse,
    JLPScheduleResponse
} from "@/types/jolpica.types";

/**
 * 
 * RIP Ergast
 * 
 */

const fetchApiData = async <T>(endpoint: string): Promise<T> => {
    try {
        const url = `https://api.jolpi.ca/ergast/f1${endpoint}/`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// --- Current Season Data ---

export const fetchCurrentSeason = () =>
    fetchApiData<JLPScheduleResponse>('/current');

export const fetchCurrentDrivers = () =>
    fetchApiData<JLPDriverStandingsResponse>('/current/driverStandings');

export const fetchCurrentConstructors = () =>
    fetchApiData<JLPConstructorStandingsResponse>('/current/constructorStandings');

// --- Details ---

export const fetchDriverDetails = (driverId: string | string[]) =>
    fetchApiData<JLPDriverDetailsResponse>(`/drivers/${driverId}`);

export const fetchConstructorDetails = (constructorId: string | string[]) =>
    fetchApiData<JLPConstructorDetailsResponse>(`/constructors/${constructorId}`);

// --- Season Data ---

export const fetchSeason = (season: string) =>
    fetchApiData<JLPScheduleResponse>(`/${season}`);

export const fetchDriverChampionship = (season: string) =>
    fetchApiData<JLPDriverStandingsResponse>(`/${season}/driverStandings`);

export const fetchConstrutorChampionship = (season: string) =>
    fetchApiData<JLPConstructorStandingsResponse>(`/${season}/constructorStandings`);

// --- Race Results ---

export const fetchRaceResults = (round: string, season?: string) =>
    fetchApiData<JLPRaceResultsResponse>(
        season ? `/${season}/${round}/results` : `/current/${round}/results`
    );

export const fetchAllRaceResults = (season: string, limit = 100) =>
    fetchApiData<JLPRaceResultsResponse>(`/${season}/results?limit=${limit}`);

export const fetchRaceResultsByCircuit = (circuitId: string, season?: string) =>
    fetchApiData<JLPRaceResultsByCircuitResponse>(
        season
            ? `/${season}/circuits/${circuitId}/results`
            : `/current/circuits/${circuitId}/results`
    );

// --- Entity-Based Results ---

export const fetchDriverResults = (
    driverId: string,
    year?: number,
    isCurrentYear?: boolean
) => {
    const endpoint = isCurrentYear
        ? `/current/drivers/${driverId}/results`
        : year
            ? `/${year}/drivers/${driverId}/results`
            : `/drivers/${driverId}/results`;

    return fetchApiData<JLPRaceResultsByDriverResponse>(endpoint);
};

export const fetchConstructorResults = (
    constructorId: string,
    year?: number,
    isCurrentYear?: boolean
) => {
    const endpoint = isCurrentYear
        ? `/current/constructors/${constructorId}/results`
        : year
            ? `/${year}/constructors/${constructorId}/results`
            : `/constructors/${constructorId}/results`;

    return fetchApiData<JLPRaceResultsByConstructorResponse>(endpoint);
};
