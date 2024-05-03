// @/components/table/CustomTable.tsxt

import { RetiredStatuses } from "@/utils/const";
import { Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell, Table, PaginationItemRenderProps, PaginationItemType, cn, getKeyValue, Skeleton } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SkeletonRow from "./SkeletonRow";

interface TableProps {
    rawData: any;
    headers: any[];
    type: string;
    isPagination?: boolean;
}

const CustomTable: React.FC<TableProps> = ({
    rawData,
    headers,
    type,
    isPagination = false
}) => {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>();
    const rowsPerPage = 4;
    const totalSkeletonRows = 10;
    const router = useRouter();

    const data = useMemo(() => {
        if (rawData) {
            switch (type) {
                case 'race':
                    return rawData.map((datum: any, index: number) => ({
                        key: datum.number,
                        endpoint: datum.Driver.code,
                        className: RetiredStatuses.includes(datum.status) ? "brightness-50" : "",
                        position: datum.position,
                        driver: `${datum.Driver.givenName} ${datum.Driver.familyName}`,
                        team: datum.Constructor.name,
                        points: datum.points,
                        time: datum.Time ? datum.Time.time : datum.status,
                        fastestLap: datum.FastestLap ? datum.FastestLap.Time.time : "No time set",
                        fastestLapClass: datum.FastestLap?.rank == 1 ? "font-bold text-[#FF00FF]" : "",
                        status: datum.status
                    }));
                case 'driversChampionship':
                case 'archiveDriversChampionship':
                    return rawData.map((datum: any, index: number) => ({
                        key: datum.Driver.code ? datum.Driver.code : index,
                        endpoint: datum.Driver.code,
                        position: datum.position,
                        acronym: datum.Driver.code,
                        name: `${datum.Driver.givenName} ${datum.Driver.familyName}`,
                        nationality: datum.Driver.nationality,
                        team: datum.Constructors[0].name,
                        points: datum.points
                    }));
                case 'constructorsChampionship':
                case 'archiveConstructorsChampionship':
                    return rawData.map((datum: any, index: number) => ({
                        key: datum.Constructor.constructorId,
                        endpoint: datum.Constructor.name,
                        position: datum.position,
                        name: datum.Constructor.name,
                        nationality: datum.Constructor.nationality,
                        wins: datum.wins,
                        points: datum.points
                    }));
                case 'archiveSeasonRaces':
                    return rawData.map((datum: any, index: number) => ({
                        key: datum.raceName,
                        endpoint: datum.raceName,
                        race: datum.raceName,
                        first: `${datum.Results[0].Driver.givenName} ${datum.Results[0].Driver.familyName}`,
                        second: `${datum.Results[1].Driver.givenName} ${datum.Results[1].Driver.familyName}`,
                        third: `${datum.Results[2].Driver.givenName} ${datum.Results[2].Driver.familyName}`
                    }));
                case 'driver':
                    return rawData.map((datum: any, index: number) => ({
                        key: datum.round,
                        endpoint: datum.raceName,
                        race: datum.raceName,
                        start: datum.Results[0].grid,
                        final: datum.Results[0].position,
                        points: datum.Results[0].points,
                        status: datum.Results[0].status,
                    }));
                case 'constructor':
                    return rawData.map((datum: any, index: number) => ({
                        key: datum.round,
                        endpoint: datum.raceName,
                        race: datum.raceName,
                        best: `${datum.Results[0].Driver.givenName} ${datum.Results[0].Driver.familyName}`,
                        final: datum.Results[0].position,
                        points: parseInt(datum.Results[0].points) + parseInt(datum.Results[1]?.points)
                    }));
                default:
                    return null;
            }
        }
    }, [rawData, type]);

    const items = useMemo(() => {
        if (isPagination) {
            setTotalPages(Math.ceil(data.length / rowsPerPage));
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return data.slice(start, end);
        } else {
            return data;
        }
    }, [page, data, isPagination]);

    const classNames = useMemo(
        () => ({
            wrapper: ["rounded-xl"],
            th: ["bg-transparent", "text-default-500", "text-sm", "border-b", "border-divider"],
            tr: ["hover:bg-red-800", "rounded-full"],
            td: ["text-default-600"],
            table: ["rounded-xl"]
        }),
        [],
    );

    const handleRowClick = (endpoint: string) => {
        let route = '/not_found';
        switch (type) {
            case 'race': // SCHEDULE
                route = `/driver/${endpoint}`
                break;
            case 'driver': // CHAMPIONSHIP
            case 'constructor': // CHAMPIONSHIP
                route = `/race/${endpoint}`
                break;
            case 'driverChampionship': // TBD
                route = `/driver/${endpoint}`
                break;
            case 'constructorChampionship': // TBD
                route = `/constructor/${endpoint}`
                break;
            case 'archiveSeasonRaces': // ARCHIVE
                route = `/archive/race/${endpoint}`
                break;
            case 'archiveDriversChampionship': // ARCHIVE
                route = `/archive/driver/${endpoint}`
                break;
            case 'archiveConstructorsChampionship': // ARCHIVE
                route = `/archive/constructor/${endpoint}`
                break;
            default:
                route = '/not_found'
                break;
        }
        router.push(route);
    }

    const skeletonRows = new Array(totalSkeletonRows).fill(null).map((_, rowIndex) => {
        const rowData = headers.reduce((acc, header) => {
            acc[header.key] = <SkeletonRow />;
            return acc;
        }, { key: rowIndex });
        return rowData;
    });

    return (
        <div className="">
            {headers && (
                <Table
                    classNames={classNames}
                    className="mx-5 mb-5"
                    radius="lg"
                    isStriped
                    aria-label={`${type}-table`}
                    bottomContent={isPagination &&
                        <div className="flex w-full justify-center">
                            <Pagination
                                loop
                                showControls
                                disableCursorAnimation
                                className="gap-2"
                                radius="md"
                                variant="flat"
                                page={page}
                                total={totalPages!}
                                renderItem={renderPaginationStyle}
                                onChange={(page: any) => setPage(page)}
                            />
                        </div>
                    }
                >
                    <TableHeader columns={headers}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    {data ? (
                        <TableBody items={items}>
                            {(item: any) => (
                                <TableRow key={item.key} className={item.className} onClick={() => handleRowClick(item.endpoint)}>
                                    {(columnKey) => {
                                        let className = ""
                                        if (type == "race") {
                                            if (item.fastestLapClass !== "" && columnKey == "fastestLap") className = item.fastestLapClass;
                                        }
                                        return (
                                            <TableCell className={className}>{getKeyValue(item, columnKey)}</TableCell>
                                        )
                                    }}
                                </TableRow>
                            )}
                        </TableBody>
                    ) : (
                        <TableBody items={skeletonRows}>
                            {(item: any) =>
                                <TableRow key={item.key}>
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                            }
                        </TableBody>
                    )}
                </Table>
            )}
        </div>
    )
}

export default CustomTable;

const renderPaginationStyle = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
}: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
        return (
            <button key={key} className={cn(className, "bg-transparent min-w-8 w-8 h-8")} onClick={onNext}>
                <ChevronRight />
            </button>
        );
    }

    if (value === PaginationItemType.PREV) {
        return (
            <button key={key} className={cn(className, "bg-transparent min-w-8 w-8 h-8")} onClick={onPrevious}>
                <ChevronLeft />
            </button>
        );
    }

    if (value === PaginationItemType.DOTS) {
        return <button key={key} className={className}>...</button>;
    }

    // cursor is the default item
    return (
        <button
            ref={ref}
            key={key}
            className={cn(
                className,
                isActive &&
                "text-black bg-primary font-bold",
                "font-light"
            )}
            onClick={() => setPage(value)}
        >
            {value}
        </button>
    );
};