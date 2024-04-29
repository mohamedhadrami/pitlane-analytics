// components/drawer/RaceDrawer.tsx

"use client"

import { MeetingParams } from "@/interfaces/openF1";
import { Link, Button, Tabs, Tab, Card, CardBody, Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerOverlay } from "../ui/drawer";

interface RaceDrawerProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    raceData: any;
    raceResults: any;
    meeting: MeetingParams;
}

const RaceDrawer: React.FC<RaceDrawerProps> = ({ isOpen, setIsOpen, raceData, raceResults, meeting }) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>();
    const rowsPerPage = 5;

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


    const items = useMemo(() => {
        if (raceResults) {
            setTotalPages(Math.ceil(raceResults.length / rowsPerPage));
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return raceResults.slice(start, end);
        }
    }, [page, raceResults]);

    return (
        <div>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-3xl">
                        <DrawerHeader className="flex w-full justify-evenly">
                            <div className="mr-auto">
                                <DrawerTitle>
                                    <Link href={`/driver`} className="text-white text-lg font-extralight" showAnchorIcon>
                                        {`${raceData.raceName}`}
                                    </Link>
                                </DrawerTitle>
                                {meeting && <DrawerDescription>{meeting.meeting_official_name}</DrawerDescription>}
                            </div>
                            {raceResults && meeting &&
                                <Button variant="light">
                                    <Link href={`/telemetry?year=${meeting.year}&meeting=${meeting.meeting_key}`} showAnchorIcon>
                                        Access Telemetry
                                    </Link>
                                </Button>}
                            <Button variant="light" color="primary" onClick={() => setIsOpen(false)} isIconOnly><X /></Button>
                        </DrawerHeader>
                        <Tabs className="items-center mx-5" color="primary">
                            <Tab key="info-tab" title="Info">
                                <Card className="m-3">
                                    <CardBody>
                                        <p>{raceData.Circuit.circuitName}</p>
                                        <p key={`${raceData.Circuit.Location.locality}`}>
                                            {`${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`}
                                        </p>
                                    </CardBody>
                                </Card>
                            </Tab>
                            {raceResults &&
                                <Tab key="resutls-table" title="Results">
                                    <div className="">
                                        <Table
                                            classNames={classNames}
                                            className="mx-5 mb-5"
                                            radius="lg"
                                            isStriped
                                            bottomContent={
                                                <div className="flex w-full justify-center">
                                                    <Pagination
                                                        isCompact
                                                        showControls
                                                        showShadow
                                                        color="secondary"
                                                        page={page}
                                                        total={totalPages!}
                                                        onChange={(page: any) => setPage(page)}
                                                    />
                                                </div>
                                            }
                                        >
                                            <TableHeader>
                                                <TableColumn>Position</TableColumn>
                                                <TableColumn>Driver</TableColumn>
                                                <TableColumn>Team</TableColumn>
                                                <TableColumn>Points</TableColumn>
                                                <TableColumn>Time</TableColumn>
                                                <TableColumn>Fastest Lap</TableColumn>
                                                <TableColumn>Status</TableColumn>
                                            </TableHeader>
                                            {raceResults ? (
                                                <TableBody items={items}>
                                                    {(item: any) => (
                                                        <TableRow key={item.number} className={`${item.status == "Retired" ? "brightness-50" : ""}`}>
                                                            <TableCell>{item.position}</TableCell>
                                                            <TableCell>{`${item.Driver.givenName} ${item.Driver.familyName}`}</TableCell>
                                                            <TableCell>{item.Constructor.name}</TableCell>
                                                            <TableCell>{item.points}</TableCell>
                                                            <TableCell>{item.Time ? item.Time.time : item.status}</TableCell>
                                                            {item.FastestLap ? (
                                                                <TableCell className={`${item.FastestLap.rank == 1 ? "font-bold text-[#FF00FF]" : ""}`}>
                                                                    {item.FastestLap.Time.time}
                                                                </TableCell>
                                                            ) : (
                                                                <TableCell>No time set</TableCell>
                                                            )}
                                                            <TableCell>{item.status}</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            ) : (
                                                <TableBody emptyContent="No data available">{[]}</TableBody>
                                            )}
                                        </Table>
                                    </div>
                                </Tab>
                            }
                        </Tabs>
                    </div>
                </DrawerContent>
                <DrawerFooter>
                    <div className="h-2"></div>
                </DrawerFooter>
            </Drawer>
        </div>
    )
}

export default RaceDrawer;