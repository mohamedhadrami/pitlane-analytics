"use client"

import { Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";

const SkeletonRow: React.FC = () => {
    return (
        <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
    )
}

export const ArchiveChampionshipTableSkeleton: React.FC = () => {

    const classNames = React.useMemo(
        () => ({
          wrapper: ["max-w-3xl", "rounded-xl"],
          th: ["bg-transparent", "text-default-500", "text-sm", "border-b", "border-divider"],
          td: ["text-default-600"],
          table: ["rounded-xl"]
        }),
        [],
      );
    const skeletonRows = new Array(10).fill(null);

    return (
        <div className="">
            <Table
                aria-label="Drivers Championship Archive Table Skeleton"
                classNames={classNames}
                className="m-5"
                radius="lg"
                isStriped
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
                    {skeletonRows.map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><SkeletonRow /></TableCell>
                            <TableCell><SkeletonRow /></TableCell>
                            <TableCell><SkeletonRow /></TableCell>
                            <TableCell><SkeletonRow /></TableCell>
                            <TableCell><SkeletonRow /></TableCell>
                            <TableCell><SkeletonRow /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
