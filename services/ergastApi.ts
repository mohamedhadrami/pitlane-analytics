// services/api.ts

const fetchApiData = async (endpoint: string) => {
    try {
        const url = `https://ergast.com/api/f1${endpoint}`;
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
    const endpoint = '/current.json';
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchCurrentDrivers = async () => {
    const endpoint = '/current/driverStandings.json';
    const data = fetchApiData(endpoint);
    return data;
}

export const fetchCurrentConstructors = async () => {
    const endpoint = '/current/constructorStandings.json';
    const data = await fetchApiData(endpoint);
    return data;
}


// DETAILS

export const fetchDriverDetails = async (driverId: string | string[]) => {
    const endpoint = `/drivers/${driverId}.json`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchConstructorDetails = async (constructorId: string | string[]) => {
    const endpoint = `/constructors/${constructorId}.json`;
    const data = await fetchApiData(endpoint);
    return data;
}


// GENERAL

export const fetchSeason = async (season: any) => {
    const endpoint = `/${season}.json`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchDriverChampionship = async (season: any) => {
    const endpoint = `/${season}/driverStandings.json`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchConstrutorChampionship = async (season: any) => {
    const endpoint = `/${season}/constructorStandings.json`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchRaceResults = async (round: any, season?: any, isCurrentYear?: boolean) => {
    let endpoint =  `/current/${round}/results.json`;
    if (season) endpoint = `/${season}/${round}/results.json`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchRaceResultsByCircuit = async (circuitId: any, season?: any, isCurrentYear?: boolean) => {
    let endpoint =  `/current/circuits/${circuitId}/results.json`;
    if (season) endpoint = `/${season}/circuits/${circuitId}/results.json`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchAllRaceResults = async (season: any) => {
    let endpoint =  `/${season}/results.json?limit=999`;
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchDriverResults = async (driverId: string, year?: number, isCurrentYear?: boolean) => {
    let endpoint = year ? `/${year}/drivers/${driverId}/results.json` : `/drivers/${driverId}/results.json`;
    if (isCurrentYear) endpoint = `/current/drivers/${driverId}/results.json`
    const data = await fetchApiData(endpoint);
    return data;
}

export const fetchConstructorResults = async (constructorId: string, year?: number, isCurrentYear?: boolean) => {
    let endpoint = year ? `/${year}/constructors/${constructorId}/results.json` : `/drivers/${constructorId}/results.json`;
    if (isCurrentYear) endpoint = `/current/constructors/${constructorId}/results.json`
    const data = await fetchApiData(endpoint);
    return data;
}
