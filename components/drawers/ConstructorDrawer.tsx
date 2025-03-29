// @/components/drawers/ConstructorDrawer.tsx

import type React from "react";
import { useState, useEffect } from "react";
import { fetchConstructorResults } from "@/services/jolpicaApi";
import { Link, Button, Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerOverlay } from "../ui/drawer";
import { X, Minus } from "lucide-react";
import { ConstructorHeader } from "@/utils/const";
import CustomTable from "../tables/CustomTable";
import type { JLPConstructorStandingItem, JLPRaceResults } from "@/types/jolpica.types";

interface DriverDrawerProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  constructorTeam: JLPConstructorStandingItem;
  teamName: string;
}

const ConstructorDrawer: React.FC<DriverDrawerProps> = ({ isOpen, setIsOpen, constructorTeam, teamName }) => {
  const [results, setResults] = useState<JLPRaceResults[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchConstructorResults(constructorTeam.Constructor.constructorId, undefined, true);
      setResults(data?.MRData.RaceTable.Races);
    }
    fetchData();
  });

  return (
    <div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-3xl">
            <DrawerHeader className="flex w-full justify-evenly">
              <div className="mr-auto">
                <DrawerTitle>
                  <Link href={`/constructor/${constructorTeam.Constructor.constructorId}`} className="text-white text-lg font-extralight" showAnchorIcon>
                    {teamName}
                  </Link>
                </DrawerTitle>
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
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="results-table" title="Results">
                <CustomTable
                  rawData={results}
                  headers={ConstructorHeader}
                  type="constructor"
                  isPagination
                />
              </Tab>
            </Tabs>
          </div>
        </DrawerContent>
        <DrawerFooter>
          <div className="h-2">&nbsp;</div>
        </DrawerFooter>
        <DrawerOverlay className="bg-[#e10600aa]" />
      </Drawer>
    </div>
  )
}

export default ConstructorDrawer;