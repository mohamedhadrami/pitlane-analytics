// @/components/Telemetry2/TelemetryBreadcrumbs.tsx

import { Breadcrumbs, BreadcrumbItem, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, type Selection, Chip } from "@heroui/react";
import BreadcrumbSelector from "./BreadcrumbSelector";
import { useTelemetry } from "@/context/TelemetryContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronDownIcon, MapPin, Timer } from "lucide-react";
import { useToggleDriverSelect } from "@/hooks/Telemetry/useToggleDriverSelect";
import { Separator } from "../ui/separator";
import type { OFDriver } from "@/types/openF1.types";

const TelemetryBreadcrumbs: React.FC = () => {

    const {
        years,
        meetings,
        sessions,
        setSelectedYear,
        setSelectedMeetingKey,
        setSelectedSessionKey,
        selectedYear,
        selectedMeeting,
        selectedMeetingKey,
        selectedSession,
        selectedSessionKey,
        setSelectedLap,

        drivers,
        selectedDrivers,
        selectedLap
    } = useTelemetry();

    const toggleDriverSelect = useToggleDriverSelect();

    const selections = {
        "year": {
            values: years,
            disabled: years.length === 0,
            selectedValue: selectedYear,
            icon: <CalendarDays size={15} />
        },
        "meeting": {
            values: meetings,
            disabled: meetings.length === 0,
            selectedValue: selectedMeetingKey,
            icon: <MapPin size={15} />
        },
        "session": {
            values: sessions,
            disabled: sessions.length === 0,
            selectedValue: selectedSessionKey,
            icon: <Timer size={15} />
        }
    }

    type SelectorLabel = keyof typeof selections;

    const getValue = (label?: string): string | undefined => {
        if (!label) return undefined;

        switch (label) {
            case "year":
                return selectedYear ?? undefined;
            case "meeting":
                return selectedMeeting?.meeting_official_name;
            case "session":
                return selectedSession?.session_name;
            default:
                return undefined;
        }
    };

    const setValue = (value: string, label: string) => {
        switch (label) {
            case "year":
                setSelectedYear(value);
                break;
            case "meeting": {
                const meeting = meetings?.find(v => v.meeting_official_name === value);
                if (meeting) setSelectedMeetingKey(Number(meeting.meeting_key));
                break;
            }
            case "session": {
                const session = sessions?.find(v => v.session_name === value);
                if (session) setSelectedSessionKey(Number(session.session_key));
                break;
            }
        }


        const [driverBreadcrumb, setDriverBreadcrumb] = useState<string>("");
        const [selectedDriverKeys, setSelelectDriverKeys] = useState<string[]>([]);

        useEffect(() => {
            if (selectedDrivers.size > 0) {
                const acronyms = Array.from(selectedDrivers.values()).map(d => d.driver.name_acronym);

                setDriverBreadcrumb(acronyms.join(", "));

                const keys: string[] = [];
                selectedDrivers.forEach((driver, key) => {
                    keys.push(key)
                })

                setSelelectDriverKeys(keys)

            } else {
                setDriverBreadcrumb("");
                setSelelectDriverKeys([]);
            }
        }, [selectedDrivers]);

        const handleChange = (keys: Selection) => {
            if (keys === "all") return;

            const latestSelection = Array.from(keys).pop();
            if (!latestSelection) return;

            const driver = drivers.find(
                (d) => d.driver_number === Number.parseInt(latestSelection.toString())
            );

            if (driver) {
                toggleDriverSelect(driver);
            }
        };

        const handleCloseLapSelected = () => {
            if (selectedLap) {
                setSelectedLap(undefined)
            }
        };


        return (
            <Breadcrumbs
                variant="light"
                separator={<Separator orientation="vertical" className="h-8" />}
            >
                {(Object.keys(selections) as SelectorLabel[])
                    .filter((key) => !selections[key].disabled)
                    .map((key) => (
                        <BreadcrumbItem key={key}>
                            <motion.div
                                key={`breadcrumb-${key}`}
                                initial={{ opacity: 0, x: -25 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <BreadcrumbSelector
                                    label={key}
                                    values={selections[key].values}
                                    icon={selections[key as keyof typeof selections].icon}
                                    onChange={setValue}
                                    displayValue={getValue}
                                    selectedValue={selections[key as keyof typeof selections].selectedValue!}
                                    disabled={selections[key].disabled}
                                />
                            </motion.div>
                        </BreadcrumbItem>
                    ))
                }
                {driverBreadcrumb && (
                    <BreadcrumbItem>
                        <motion.div
                            key="breadcrumb-drivers"
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Dropdown
                                backdrop="blur"
                                isDisabled={selectedDrivers.size === 0}
                                shouldBlockScroll={false}>
                                <DropdownTrigger>
                                    <Button
                                        variant="light"
                                        color="default"
                                        size="sm"
                                        radius="sm"
                                        endContent={<ChevronDownIcon className="text-default-500" />}
                                        className="capitalize"
                                    >
                                        {driverBreadcrumb}
                                    </Button>
                                </DropdownTrigger>
                                {selectedDrivers && selectedDrivers.size > 0 && (
                                    <DropdownMenu
                                        aria-label="driver-selection"
                                        variant="solid"
                                        color="primary"
                                        selectionMode="multiple"
                                        selectedKeys={selectedDriverKeys}
                                        onSelectionChange={(keys: Selection) => handleChange(keys)}
                                    >
                                        {drivers.map((driver) => (
                                            <DropdownItem key={driver.driver_number}>
                                                {driver.name_acronym}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                )}
                            </Dropdown>
                        </motion.div>
                    </BreadcrumbItem>
                )}
                {selectedLap && (
                    <BreadcrumbItem key="breadcrumb-lap">
                        <motion.div
                            key="breadcrumb-lap"
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Chip onClose={handleCloseLapSelected}>
                                Lap: {selectedLap}
                            </Chip>
                        </motion.div>
                    </BreadcrumbItem>
                )}
            </Breadcrumbs>
        );
    }
}

export default TelemetryBreadcrumbs;
