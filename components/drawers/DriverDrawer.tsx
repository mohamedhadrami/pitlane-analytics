// @/components/drawers/DriverDrawer.tsx

import React, { useState, useEffect } from "react";
import { DriverParams } from "@/interfaces/openF1";
import { fetchDriverResults } from "@/services/ergastApi";
import { Link, Button, Tabs, Tab, Card, CardBody, Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerOverlay } from "../ui/drawer";
import { X, Minus } from "lucide-react";

interface DriverDrawerProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  driver: any;
  driverData: DriverParams;
}

const DriverDrawer: React.FC<DriverDrawerProps> = ({ isOpen, setIsOpen, driver, driverData }) => {
  const [driverResults, setDriverResults] = useState<any>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>();
  const rowsPerPage = 4;

  const classNames = React.useMemo(
    () => ({
      wrapper: ["rounded-xl"],
      th: ["bg-transparent", "text-default-500", "text-sm", "border-b", "border-divider"],
      tr: ["hover:bg-red-800", "rounded-full"],
      td: ["text-default-600"],
      table: ["rounded-xl"]
    }),
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDriverResults(driver.Driver.driverId, undefined, true);
      setDriverResults(data?.MRData.RaceTable.Races);
    }
    fetchData();
  });


  const items = React.useMemo(() => {
    if (driverResults) {
      setTotalPages(Math.ceil(driverResults.length / rowsPerPage));
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return driverResults.slice(start, end);
    }
  }, [page, driverResults]);

  return (
    <div>
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
                      <TableColumn>Race</TableColumn>
                      <TableColumn>Starting Position</TableColumn>
                      <TableColumn>Final Position</TableColumn>
                      <TableColumn>Total Points</TableColumn>
                      <TableColumn>Status</TableColumn>
                    </TableHeader>
                    {driverResults ? (
                      <TableBody items={items}>
                        {(item: any) => (
                          <TableRow key={item.round}>
                            <TableCell>{item.raceName}</TableCell>
                            <TableCell>{item.Results[0].grid}</TableCell>
                            <TableCell>{item.Results[0].position}</TableCell>
                            <TableCell>{item.Results[0].points}</TableCell>
                            <TableCell>{item.Results[0].status}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    ) : (
                      <TableBody emptyContent="No data available">{[]}</TableBody>
                    )}
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </div>
        </DrawerContent>
        <DrawerFooter>
          <div className="h-2"></div>
        </DrawerFooter>
        <DrawerOverlay className="bg-[#e10600aa]" />
      </Drawer>
    </div>
  )
}

export default DriverDrawer;