

const fetchApiData = async (endpoint: string) => {
    try {
        const url = `https://api.multiviewer.app/api/v1${endpoint}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Multiviewer data:', error);
        throw error;
    }
}

export const fetchCircuitByKey = async (circuitKey: number, year: string) => {
    const endpoint = `/circuits/${circuitKey}/${year}`;
    const data = await fetchApiData(endpoint);
    return data;
}
