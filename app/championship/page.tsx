"use client"

import { useEffect, useState } from "react";
import {
    fetchCurrentConstructors,
    fetchCurrentDrivers,
} from "../../services/jolpicaApi";
import DriverChampionshipCard from "./DriverChampionshipCard";
import ConstructorChampionshipCard from "./ConstructorChampionshipCard";
import type { DriverParams } from "@/types/openF1";
import { fetchDrivers } from "@/services/openF1Api";
import { Divider } from "@heroui/react";
import type { DriverStandingsResponse, ConstructorStandingsResponse, ConstructorStandingItem, DriverStandingItem } from "@/types/jolpica.types";


const Page: React.FC = () => {

    const [driverData, setDriverData] = useState<DriverStandingsResponse>();
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [constructorData, setConstructorData] = useState<ConstructorStandingsResponse>();
    const [year, setYear] = useState<string>("");

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const apiDriverData = await fetchCurrentDrivers();
                const apiConstructorData = await fetchCurrentConstructors();
                setDriverData(apiDriverData);
                setConstructorData(apiConstructorData);
                setYear(apiDriverData.MRData.StandingsTable.season);

                const params: DriverParams = {
                    session_key: "latest"
                }
                const openApiDrivers = await fetchDrivers(params);
                setDrivers(openApiDrivers)
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchDataFromApi();
    }, []);

    const show: boolean = false;

    return (
        <>
            <h1 className="text-3xl font-light py-5 text-center">Driver Standings</h1>
            <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-8 px-15 pb-30">
                {drivers.length > 1 && driverData?.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
                    (driver: DriverStandingItem) => (
                        <div key={driver.Driver.code} className="flex justify-center">
                            <DriverChampionshipCard
                                key={`${driver.Driver.code}_champ-card`}
                                driver={driver}
                                drivers={drivers}
                                year={year} />
                        </div>
                    ))}
            </div>
            <Divider className="m-5 w-3/4 mx-auto" />
            <h1 className="text-3xl font-light py-5 text-center">Constructors Standings</h1>
            <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-8 px-15 pb-30">
                {drivers.length > 1 && constructorData?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
                    (constructorTeam: ConstructorStandingItem) => (
                        <div key={constructorTeam.Constructor.constructorId} className="flex justify-center">
                            <ConstructorChampionshipCard
                                key={`${constructorTeam.Constructor.constructorId}_champ-card`}
                                constructor={constructorTeam}
                                drivers={drivers}
                                year={year}
                            />
                        </div>
                    )
                )}
            </div>
        </>
    )
}


export default Page;