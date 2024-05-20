// @/components/drawers/DriverDrawer.tsx

import React, { useState, useEffect } from "react";
import { DriverParams } from "@/interfaces/openF1";
import { fetchDriverResults } from "@/services/ergastApi";
import { Link, Button, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerOverlay } from "../ui/drawer";
import { X, Minus } from "lucide-react";
import CustomTable from "../tables/CustomTable";
import { DriverHeader } from "@/utils/const";

interface DriverDrawerProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  driver: any;
  driverData: DriverParams;
}

const DriverDrawer: React.FC<DriverDrawerProps> = ({ isOpen, setIsOpen, driver, driverData }) => {
  const [results, setResults] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDriverResults(driver.Driver.driverId, undefined, true);
      setResults(data?.MRData.RaceTable.Races);
    }
    fetchData();
  });

  return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-3xl">
            <DrawerHeader className="flex w-full justify-evenly">
              <div className="mr-auto">
                <DrawerTitle>
                  <Link href={`/driver/${driver.Driver.code}`} className="text-white text-lg font-extralight" showAnchorIcon>
                    {`${driverData.first_name} ${driverData.last_name}`}
                  </Link>
                </DrawerTitle>
                <DrawerDescription>{driver.Constructors[0].name}</DrawerDescription>
              </div>
              <Button variant="light" color="primary" onClick={() => setIsOpen(false)} isIconOnly><X /></Button>
            </DrawerHeader>
            <Tabs className="items-center mx-5" color="primary">
              <Tab title="About">
                <Card className="mx-5 mb-5">
                  <CardBody className="flex flex-row gap-1">
                    <div className="">
                      <p>Number</p>
                      <p>Birthday</p>
                      <p>Nationality</p>
                      <p>Wiki</p>
                    </div>
                    <div className="font-thin">
                      <Minus />
                      <Minus />
                      <Minus />
                      <Minus />
                    </div>
                    <div className="font-extralight">
                      <p>{driverData.driver_number}</p>
                      <p>{driver.Driver.dateOfBirth}</p>
                      <p>{driver.Driver.nationality}</p>
                      <p>{driver.Driver.url}</p>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="resutls-table" title="Results">
                <CustomTable
                  rawData={results}
                  headers={DriverHeader}
                  type="driver"
                  isPagination
                />
              </Tab>
            </Tabs>
          </div>
        </DrawerContent>
        <DrawerOverlay className="bg-[#e10600aa]" />
      </Drawer>
  )
}

export default DriverDrawer;