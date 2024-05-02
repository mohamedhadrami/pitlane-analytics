// @/app/archive/ArchiveConstructorsTable.tsx

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const ArchiveConstructorsTable: React.FC<{ data: any }> = ({ data }) => {
    const router = useRouter();

    const handleRowClick = (constructor: any) => {
        router.push(`/constructor/${constructor.Constructor.constructorId}`);
    };

    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-w-3xl", "rounded-xl"],
            th: ["bg-transparent", "text-default-500", "text-sm", "border-b", "border-divider"],
            tr: ["hover:bg-red-800", "rounded-full"],
            td: ["text-default-600"],
            table: ["rounded-xl"]
        }),
        [],
    );

    const hasStandingsData = data?.MRData.StandingsTable.StandingsLists[0];

    return (
        <div>
            <Table
                classNames={classNames}
                className=""
                radius="lg"
                isStriped
                aria-label="constructor-table"
            >
                <TableHeader>
                    <TableColumn>Position</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Nationality</TableColumn>
                    <TableColumn>Wins</TableColumn>
                    <TableColumn>Points</TableColumn>
                </TableHeader>
                {hasStandingsData ? (
                    <TableBody>
                        {data?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map((constructors: any, index: number) => (
                            <TableRow key={constructors.Constructor.constructorId} onClick={() => handleRowClick(constructors)}>
                                <TableCell>{constructors.position}</TableCell>
                                <TableCell>{constructors.Constructor.name}</TableCell>
                                <TableCell>{constructors.Constructor.nationality}</TableCell>
                                <TableCell>{constructors.wins}</TableCell>
                                <TableCell>{constructors.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : (
                    <TableBody emptyContent="No data available">{[]}</TableBody>
                )}
            </Table>
        </div >
    );
};

export default ArchiveConstructorsTable;
