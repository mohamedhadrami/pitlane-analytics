// services/jolpicaApi.ts

/**
 * 
 * RIP Ergast
 * 
 */

const fetchApiData = async (endpoint: string) => {
    try {
        const url = `https://api.jolpi.ca/ergast/f1${endpoint}.json`;
        const response = await fetch(url);
        const data = await response.json();
        //console.log(url);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// CURRENT

export const fetchCurrentSeason = async () => {
    const endpoint = '/current';
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchCurrentDrivers = async () => {
    const endpoint = '/current/driverStandings';
    const data = fetchApiData(endpoint);
    return data;
}

export const fetchCurrentConstructors = async () => {
    const endpoint = '/current/constructorStandings';
    const data = await fetchApiData(endpoint);
    return data;
}


// DETAILS

export const fetchDriverDetails = async (driverId: string | string[]) => {
    const endpoint = `/drivers/${driverId}`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchConstructorDetails = async (constructorId: string | string[]) => {
    const endpoint = `/constructors/${constructorId}`;
    const data = await fetchApiData(endpoint);
    return data;
}


// GENERAL

export const fetchSeason = async (season: string) => {
    const endpoint = `/${season}`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchDriverChampionship = async (season: string) => {
    const endpoint = `/${season}/driverStandings`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchConstrutorChampionship = async (season: string) => {
    const endpoint = `/${season}/constructorStandings`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchRaceResults = async (round: string, season?: string, isCurrentYear?: boolean) => {
    let endpoint = `/current/${round}/results`;
    if (season) endpoint = `/${season}/${round}/results`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchRaceResultsByCircuit = async (circuitId: string, season?: string, isCurrentYear?: boolean) => {
    let endpoint = `/current/circuits/${circuitId}/results`;
    if (season) endpoint = `/${season}/circuits/${circuitId}/results`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchAllRaceResults = async (season: string) => {
    const endpoint = `/${season}/results?limit=999`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchDriverResults = async (driverId: string, year?: number, isCurrentYear?: boolean) => {
    let endpoint = year ? `/${year}/drivers/${driverId}/results` : `/drivers/${driverId}/results`;
    if (isCurrentYear) endpoint = `/current/drivers/${driverId}/results`
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchConstructorResults = async (constructorId: string, year?: number, isCurrentYear?: boolean) => {
    let endpoint = year ? `/${year}/constructors/${constructorId}/results` : `/drivers/${constructorId}/results`;
    if (isCurrentYear) endpoint = `/current/constructors/${constructorId}/results`
    const data = await fetchApiData(endpoint);
    return data;
}
