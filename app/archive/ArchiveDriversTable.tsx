// pages/drivers.tsx

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const ArchiveDriversTable: React.FC<{ data: any }> = ({ data }) => {
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

    const hasDriverCode = data?.MRData.StandingsTable.StandingsLists[0].DriverStandings.some((driver: any) => driver.Driver.code);

    return (
        <div className="">
            <Table
                classNames={classNames}
                className=""
                radius="lg"
                isStriped
                aria-label="constructor-table"
            >
                <TableHeader>
                    <TableColumn>Position</TableColumn>
                    <TableColumn>Driver Code</TableColumn>
                    <TableColumn>Full Name</TableColumn>
                    <TableColumn>Nationality</TableColumn>
                    <TableColumn>Team</TableColumn>
                    <TableColumn>Points</TableColumn>
                </TableHeader>
                <TableBody>
                    {data?.MRData.StandingsTable.StandingsLists[0].DriverStandings.map((driver: any, index: number) => (
                        <TableRow key={driver.Driver.code} onClick={() => handleRowClick(driver)}>
                            <TableCell>{driver.position}</TableCell>
                            {hasDriverCode && <TableCell>{driver.Driver.code}</TableCell>}
                            <TableCell>{`${driver.Driver.givenName} ${driver.Driver.familyName}`}</TableCell>
                            <TableCell>{driver.Driver.nationality}</TableCell>
                            <TableCell>{driver.Constructors[0].name}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ArchiveDriversTable;
