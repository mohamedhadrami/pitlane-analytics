// services/countryApi.ts

const fetchRestCountryApi = async (endpoint: string) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1${endpoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchCountryFlagByName = async (country: string) => {
    let countryName = country;
    if (countryName === "UK") countryName = "United Kingdom";
    else if (countryName === "China") countryName = "Zhōngguó";
    else if (countryName === "Netherlands") countryName = "Kingdom of the Netherlands";
    const endpoint = `/name/${countryName}`;
    const data = await fetchRestCountryApi(endpoint);
    const flagData = data[0]?.flags;
    return flagData;
}

export const fetchCountryFlagByCode = async (country_code: string) => {
    const endpoint = `alpha/${country_code}`;
    const data = await fetchRestCountryApi(endpoint);
    const flagData = data[0]?.flags;
    return flagData;
}

export const fetchCountryFlagByDemonym = async (demonym: string) => {
    const endpoint = `/demonym/${demonym}`;
    const data = await fetchRestCountryApi(endpoint);
    const flagData = data[0]?.flags;
    return flagData;
}

export const fetchCountryNameByCode = async (country_code: string) => {
    let endpoint = `/alpha/${country_code}`;
    if (country_code == undefined) endpoint = "USA"
    const data = await fetchRestCountryApi(endpoint);
    const name = data[0]?.name.common;
    return name;
}