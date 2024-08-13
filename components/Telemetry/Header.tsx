// @/components/Telemtry/Header.tsx

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";
import TelemetryBreadcrumbs from "./TelemetryBreadcrumbs";
import { useTelemetry } from "@/context/TelemetryContext";
import { Button, Divider, Image } from "@heroui/react";
import { fetchCountryFlagByName } from "@/services/countryApi";
import { useState, useEffect } from "react";
import { useHandleNextStage, useHandlePreviousStage } from "@/hooks/Telemetry/useTelemetryUI";
import { useTelemetryUI } from "@/context/TelemetryUIContext";

const Header: React.FC = () => {

    const { selectedMeeting, setSelectedYear } = useTelemetry();
    const { previousStage, nextStage } = useTelemetryUI();
    const handleNextStage = useHandleNextStage();
    const handlePreviousStage = useHandlePreviousStage();

    const [flag, setFlag] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const flagApiData = await fetchCountryFlagByName(selectedMeeting?.country_name!);
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
                    <RotateCcw onClick={() => setSelectedYear(undefined)} />
                </div>
            </div>

            <Button onClick={handleNextStage} variant="light" isDisabled={nextStage === undefined} isIconOnly>
                <ChevronRight />
            </Button>
        </motion.div>
    )
}

export default Header;