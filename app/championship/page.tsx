"use client"

import { useEffect, useState } from "react";
import {
    fetchCurrentConstructors,
    fetchCurrentDrivers,
} from "../../services/ergastApi";
import DriverChampionshipCard from "./DriverChampionshipCard";
import ConstructorChampionshipCard from "./ConstructorChampionshipCard";
import { DriverParams } from "@/interfaces/openF1";
import { fetchDrivers } from "@/services/openF1Api";
import { Divider } from "@nextui-org/react";


const Page: React.FC = () => {

    const [driverData, setDriverData] = useState<any>(null);
    const [drivers, setDrivers] = useState<DriverParams[]>([]);
    const [constructorData, setConstructorData] = useState<any>(null);
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
                {drivers.length > 1 && driverData?.MRData.StandingsTable.StandingsLists[0].DriverStandings.map((driver: any, index: number) => (
                    <div key={index} className="flex justify-center">
                        <DriverChampionshipCard
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
                    (constructor: any, index: number) => (
                        <ConstructorChampionshipCard
                            constructor={constructor}
                            drivers={drivers}
                            year={year}
                        />
                    )
                )}
            </div>
        </>
    )
}


export default Page;