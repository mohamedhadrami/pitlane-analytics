// @/components/Telemtry/Header.tsx

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";
import TelemetryBreadcrumbs from "./TelemetryBreadcrumbs";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
<<<<<<< HEAD
import { Button, Divider, Image } from "@nextui-org/react";
=======
import { Button, Divider, Image } from "@heroui/react";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
import { fetchCountryFlagByName } from "@/services/countryApi";
import { useState, useEffect } from "react";
import { useHandleNextStage, useHandlePreviousStage } from "@/hooks/Telemetry/useTelemetryUI";
import { useTelemetryUI } from "@/context/Telemetry/TelemetryUIContext";
<<<<<<< HEAD
=======
import type { RCFlags } from "@/types/restCountries";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c

const Header: React.FC = () => {

    const { selectedMeeting, setSelectedYear } = useTelemetry();
    const { previousStage, nextStage } = useTelemetryUI();
    const handleNextStage = useHandleNextStage();
    const handlePreviousStage = useHandlePreviousStage();

<<<<<<< HEAD
    const [flag, setFlag] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const flagApiData = await fetchCountryFlagByName(selectedMeeting?.country_name!);
=======
    const [flag, setFlag] = useState<RCFlags>();

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedMeeting) return
            const flagApiData = await fetchCountryFlagByName(selectedMeeting?.country_name);
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
            setFlag(flagApiData);
        }
        if (selectedMeeting) fetchData();
    }, [selectedMeeting])

    return (
        <motion.div
            key="breadcrumb"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-row items-center p-1 gap-1"
        >
            <Button onClick={handlePreviousStage} variant="light" isDisabled={previousStage === undefined} isIconOnly>
                <ChevronLeft />
            </Button>

            <div className="flex flex-row w-full">
                <div className="">
                    <TelemetryBreadcrumbs />
                </div>

                <div className="ml-auto flex flex-row gap-3 items-center">
                    {selectedMeeting && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, x: 100 }}
                            exit={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-row items-center gap-3 text-sm font-extralight"
                        >
                            <p>
                                {selectedMeeting.meeting_official_name}
                            </p>
                            <Divider orientation="vertical" className="h-5" />
                            <p>
                                {`${selectedMeeting.location}, ${selectedMeeting.country_name}`}
                            </p>
                            <Image
                                className="rounded-md border border-default-100"
                                alt="flag image"
                                width={40}
                                src={flag?.png} />
                            <Info />
                        </motion.div>
                    )}
<<<<<<< HEAD
                    <RotateCcw onClick={() => setSelectedYear(undefined)} />
                </div>
            </div>

            <Button onClick={handleNextStage} variant="light" isDisabled={nextStage == undefined} isIconOnly>
=======
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <RotateCcw className="cursor-pointer" />
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            className="glow-color"
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset telemetry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will clear all selected data and return you to the first step. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => setSelectedYear(undefined)}>
                                    Reset
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Button onClick={handleNextStage} variant="light" isDisabled={nextStage === undefined} isIconOnly>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                <ChevronRight />
            </Button>
        </motion.div>
    )
}

export default Header;