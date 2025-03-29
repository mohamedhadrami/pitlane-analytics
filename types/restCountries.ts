
export type RCNameResponse = RCName[];

export type RCName = {
    name: {
        common: string,
        official: string,
        "nativeName": {
            "deu": {
                "official": "Bundesrepublik Deutschland",
                "common": "Deutschland"
            }
        }
    },
    tld: string[],
    cca2: string,
    ccn3: string,
    cca3: string,
    cioc: string,
    independent: boolean,
    status: string,
    unMember: boolean,
    "currencies": {
        "EUR": {
            "name": "Euro",
            "symbol": "€"
        }
    },
    idd: {
        root: string,
        suffixes: string[]
    },
    capital: string[],
    altSpellings: string[],
    region: string,
    subregion: string,
    "languages": {
        "deu": "German"
    },
    translations: {
        [languageCode: string]: RCTranslation;
    },
    latlng: number[],
    landlocked: boolean,
    borders: string[],
    area: number,
    "demonyms": {
        "eng": {
            "f": "German",
            "m": "German"
        },
        "fra": {
            "f": "Allemande",
            "m": "Allemand"
        }
    },
    flag: string,
    maps: {
        googleMaps: string,
        openStreetMaps: string
    },
    population: number,
    "gini": {
        "2016": 31.9
    },
    fifa: string,
    "car": {
        "signs": [
            "DY"
        ],
        "side": "right"
    },
    timezones: string[],
    continents: string[],
    flags: RCFlags,
    coatOfArms: {
        png: string,
        svg: string
    },
    startOfWeek: string,
    "capitalInfo": {
        "latlng": [
            52.52,
            13.4
        ]
    },
    postalCode: {
        format: string,
        regex: string
    }
}


export type RCTranslation = {
    official: string;
    common: string;
}


export type RCFlags = {
    png: string,
    svg: string,
    alt: string
}