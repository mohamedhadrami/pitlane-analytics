// @/app/archive/page.tsx

"use client"

import { fetchAllRaceResults, fetchConstrutorChampionship, fetchDriverChampionship } from "@/services/ergastApi";
import { Autocomplete, AutocompleteItem, Button, Divider, Tab, Tabs } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomTable from "@/components/tables/CustomTable";
import { ConstructorChampionshipHeaders, DriverChampionshipHeaders, SeasonRacesHeaders } from "@/utils/const";

const Page: React.FC = () => {
    const [drivers, setDrivers] = useState<any>(null);
    const [constructors, setConstructors] = useState<any>(null);
    const [races, setRaces] = useState<any>(null);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams) {
            const queryYear = searchParams.get("year");
            if (queryYear) setSelectedYear(queryYear);
        }
    }, [searchParams])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const years = Array.from({ length: new Date().getFullYear() - 1949 }, (_, index) => (new Date().getFullYear() - index).toString());
    const currentYear = new Date().getFullYear();
    const telemetryYears = Array.from(
        { length: currentYear - 2022 },
        (_, index) => currentYear - index
    );

    const onSelectionChange = (key: React.Key) => {
        if (key.toString() == selectedYear) return null;
        setSelectedYear(key.toString());
    }

    const handleTelemetryAccess = () => router.push(`/telemetry?year=${selectedYear}`);

    useEffect(() => {
        const fetchData = async (season: string) => {
            const driversData = await fetchDriverChampionship(season);
            setDrivers(driversData);
            const constructorsData = await fetchConstrutorChampionship(season);
            setConstructors(constructorsData);
            const raceData = await fetchAllRaceResults(season);
            setRaces(raceData);
        };

        if (selectedYear) {
            setDrivers(null);
            setConstructors(null);
            fetchData(selectedYear);
        }
    }, [selectedYear]);

    return (
        <div className="max-w-screen-lg mx-auto">
            <div>
                <div className="flex items-center h-auto">
                    <h1 className="text-3xl font-light p-5">Archive</h1>
                    {selectedYear && (
                        <>
                            <Divider orientation="vertical" className="h-10" />
                            <h2 className="text-2xl font-thin p-5">{selectedYear} Season</h2>
                        </>
                    )}
                </div>
                <div className="flex flex-row p-5">
                    <Autocomplete
                        label="Select a year"
                        className="max-w-xs"
                        onSelectionChange={onSelectionChange}
                    >
                        {years.map((year) => (
                            <AutocompleteItem key={year} value={year}>
                                {year}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    {selectedYear && telemetryYears.includes(parseInt(selectedYear)) && (
                        <div className="inline-flex items-center ml-auto">
                            <Button
                                className="ml-auto"
                                color="primary"
                                variant="ghost"
                                onClick={handleTelemetryAccess}
                            >
                                Access Telemetry for {selectedYear}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {selectedYear && (
                <div className="mx-5 w-full">
                    <Tabs className="" color="primary" isVertical={!isMobile}>
                        <Tab key="drivers" title="Drivers" className="">
                            <CustomTable
                                rawData={drivers?.MRData.StandingsTable.StandingsLists[0].DriverStandings}
                                headers={DriverChampionshipHeaders}
                                type="archiveDriversChampionship"
                            />
                        </Tab>
                        <Tab key="constructors" title="Constructors" className="">
                            <CustomTable
                                rawData={constructors?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings}
                                headers={ConstructorChampionshipHeaders}
                                type="archiveConstructorsChampionship"
                            />
                        </Tab>
                        <Tab key="races" title="Races" className="">
                            <CustomTable
                                rawData={races?.MRData.RaceTable.Races}
                                headers={SeasonRacesHeaders}
                                type="archiveSeasonRaces"
                            />
                        </Tab>
                    </Tabs>
                </div>
            )}

        </div>
    );
};

export default Page;