// @/app/archive/ArchiveRacesTable.tsx

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ArchiveRacesTable: React.FC<{ data: any }> = ({ data }) => {
    const [raceSummary, setRaceSummary] = useState<any>();
    const router = useRouter();
    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-w-3xl", "rounded-xl"],
            th: ["bg-transparent", "text-default-500", "text-sm", "border-b", "border-divider"],
            td: ["text-default-600"],
            table: ["rounded-xl"]
        }),
        [],
    );

    const handleRowClick = (driver: any) => {
        router.push(`/archive/driver/${driver.Driver.driverId}`)
    };

    useEffect(() => {
        const summary = data.MRData.RaceTable.Races.map((race: any) => {
            const map = {
                raceName: race.raceName,
                first: race.Results[0].Driver.code,
                second: race.Results[1].Driver.code,
                third: race.Results[2].Driver.code,
            }
            return map;
        })
        setRaceSummary(summary)
    }, [data])

    return (
        <div className="">
            <Table
                classNames={classNames}
                className="w-full"
                radius="lg"
                isStriped
                aria-label="race-table"
            >
                <TableHeader>
                    <TableColumn>Race</TableColumn>
                    <TableColumn>1st</TableColumn>
                    <TableColumn>2nd</TableColumn>
                    <TableColumn>3rd</TableColumn>
                </TableHeader>
                {raceSummary ? (
                    <TableBody items={raceSummary}>
                        {(item: any) => (
                            <TableRow key={item.raceName}>
                                <TableCell>{item.raceName}</TableCell>
                                <TableCell>{item.first}</TableCell>
                                <TableCell>{item.second}</TableCell>
                                <TableCell>{item.third}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                ) : (
                    <TableBody emptyContent="No data available">{[]}</TableBody>
                )}
            </Table>
        </div>
    );
};

export default ArchiveRacesTable;
