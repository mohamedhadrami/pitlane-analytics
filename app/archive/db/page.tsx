// @/app/archive/db/page.tsx

"use client"
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, getKeyValue, Link } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import Loading from "@/components/Loading";
import { DbCircuits } from "@/interfaces/ergast";

const Page: React.FC = () => {
    const [tables, setTables] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/db/tables');
            const data = await res.json();
            setTables(data.rows)
        }
        fetchData()
    }, [])

    let list = useAsyncList<DbCircuits>({
        async load({ signal, cursor }) {
            const url = cursor ? cursor : `/api/db/tables/circuits`;
            const res = await fetch(url, { signal });
            const json = await res.json();

            setHasMore(json.metadata.nextPage !== null);

            setIsLoading(false);

            return {
                items: json.data,
                cursor: json.metadata.nextPage,
            };
        },
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore });

    return (
        <div className="flex flex-col p-3">
            {tables && tables.map((name: any) => (
                <p key={name.table_name}>{name.table_name}</p>
            ))}
            <Table
                isHeaderSticky
                aria-label="Example table with infinite pagination"
                baseRef={scrollerRef}
                bottomContent={
                    hasMore ? (
                        <div className="flex w-full justify-center">
                            <Spinner ref={loaderRef} color="white" />
                        </div>
                    ) : null
                }
                classNames={{
                    base: "max-h-[520px] overflow-scroll",
                    table: "min-h-[400px]",
                }}
            >
                <TableHeader>
                    <TableColumn key="circuit_id">ID</TableColumn>
                    <TableColumn key="circuit_ref">Ref</TableColumn>
                    <TableColumn key="name">Name</TableColumn>
                    <TableColumn key="location">location</TableColumn>
                    <TableColumn key="country">Country</TableColumn>
                    <TableColumn key="lat">Lat</TableColumn>
                    <TableColumn key="lng">Lng</TableColumn>
                    <TableColumn key="alt">Alt</TableColumn>
                    <TableColumn key="url">URL</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    items={list.items}
                    loadingContent={<Loading />}
                >
                    {(item) => (
                        <TableRow key={item?.name}>
                            {(columnKey) => {
                                return columnKey === "url" ? (
                                    <TableCell>
                                        <Link href={getKeyValue(item, columnKey)} showAnchorIcon>
                                            Wiki
                                        </Link>
                                    </TableCell>
                                ) : (
                                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                                );
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default Page;
