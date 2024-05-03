// @/components/drawer/RaceDrawer.tsx

import { MeetingParams } from "@/interfaces/openF1";
import { Link, Button, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "../ui/drawer";
import CustomTable from "../tables/CustomTable";
import { RaceHeaders } from "@/utils/const";

interface RaceDrawerProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    raceData: any;
    raceResults: any;
    meeting: MeetingParams;
}

const RaceDrawer: React.FC<RaceDrawerProps> = ({ isOpen, setIsOpen, raceData, raceResults, meeting }) => {

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
                                    <CustomTable 
                                        rawData={raceResults}
                                        headers={RaceHeaders}
                                        type="race"
                                        isPagination
                                    />
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