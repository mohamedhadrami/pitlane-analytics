"use client"

import { fetchConstrutorChampionship, fetchDriverChampionship } from "@/services/ergastApi";
import { Autocomplete, AutocompleteItem, Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArchiveChampionshipTableSkeleton } from "./ArchiveSkeletons";
import ArchiveDriversTable from "./ArchiveDriversTable";
import ArchiveConstructorsTable from "./ArchiveConstructorsTable";

const Page: React.FC = () => {
    const [drivers, setDrivers] = useState<any>(null);
    const [constructors, setConstructors] = useState<any>(null);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const router = useRouter();

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
        };

        if (selectedYear) {
            setDrivers(null);
            setConstructors(null);
            fetchData(selectedYear);
        }
    }, [selectedYear]);

    const show: boolean = false

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
                                onClick={handleTelemetryAccess}
                            >
                                Access Telemetry for {selectedYear}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {selectedYear && (
                <>
                    {drivers ? (
                        <div className="flex justify-center">
                            <ArchiveDriversTable data={drivers} />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <ArchiveChampionshipTableSkeleton />
                        </div>
                    )}
                    {constructors ? (
                        <div className="flex justify-center">
                            {console.log(constructors)}
                            <ArchiveConstructorsTable data={constructors} />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <ArchiveChampionshipTableSkeleton />
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default Page;