// @/components/Telemetry2/TelemetryBreadcrumbs.tsx

import { Breadcrumbs, BreadcrumbItem, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Chip } from "@nextui-org/react";
import BreadcrumbSelector from "./BreadcrumbSelector";
import { useTelemetry } from "@/context/TelemetryContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronDownIcon, MapPin, Timer } from "lucide-react";
import { DriverParams } from "@/interfaces/openF1";
import { useToggleDriverSelect } from "@/hooks/Telemetry/useTelemetryData";

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
            disabled: years.length == 0 ? true : false,
            selectedValue: selectedYear,
            icon: <CalendarDays size={15} />
        },
        "meeting": {
            values: meetings,
            disabled: meetings.length == 0 ? true : false,
            selectedValue: selectedMeetingKey,
            icon: <MapPin size={15} />
        },
        "session": {
            values: sessions,
            disabled: sessions.length == 0 ? true : false,
            selectedValue: selectedSessionKey,
            icon: <Timer size={15} />
        }
    }

    const getValue = (label: any) => {
        switch (label) {
            case "year":
                if (!selectedYear) return `Select a year`;
                return selectedYear;
            case "meeting":
                if (!selectedMeeting) return `Select a race`;
                return selectedMeeting?.meeting_name;
            case "session":
                if (!selectedSession) return `Select a session`;
                return selectedSession?.session_name;
            default:
                break;
        }
    }

    const setValue = (value: string, label: any) => {
        switch (label) {
            case "year":
                setSelectedYear(value)
                break;
            case "meeting":
                const meeting = meetings?.find(v => v.meeting_key === parseInt(value));
                setSelectedMeetingKey(Number(meeting?.meeting_key!));
                break;
            case "session":
                const session = sessions?.find(v => v.session_key === parseInt(value));
                setSelectedSessionKey(Number(session?.session_key!))
                break;
            default:
                break;
        }
    }


    const [driverBreadcrumb, setDriverBreadcrumb] = useState<string>("");
    const [selectedDriverKeys, setSelelectDriverKeys] = useState<string[]>([]);

    useEffect(() => {
        if (selectedDrivers.size > 0) {
            const acronyms: string[] = [];

            selectedDrivers.forEach((driver) => {
                acronyms.push(driver.driver.name_acronym!);
            });

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
        const latestSelection = [...keys].pop();
        const driver: DriverParams | undefined = drivers.find(d => d.driver_number === parseInt(latestSelection));
        if (driver) {
            toggleDriverSelect(driver)
        }
    }

    const handleCloseLapSelected = () => {
        if (selectedLap) {
            setSelectedLap(null)
        }
    }


    return (
        <Breadcrumbs
            variant="light"
            separator="|"
        >
            {Object.keys(selections)
                .filter((key: string) => !selections[key as keyof typeof selections].disabled)
                .map((key: string) => (
                    <BreadcrumbItem key={key}>
                        <motion.div
                            key={`breadcrumb-${key}`}
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <BreadcrumbSelector
                                id={key}
                                key={`${key}-dropdown`}
                                label={key}
                                values={selections[key as keyof typeof selections].values}
                                icon={selections[key as keyof typeof selections].icon}
                                onChange={setValue}
                                displayValue={getValue}
                                selectedValue={selections[key as keyof typeof selections].selectedValue}
                                disabled={selections[key as keyof typeof selections].disabled}
                            />
                        </motion.div>
                    </BreadcrumbItem>
                ))}
            {driverBreadcrumb && (
                <BreadcrumbItem>
                    <motion.div
                        key={`breadcrumb-drivers`}
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
                                    aria-label={`driver-selection`}
                                    variant="solid"
                                    color="primary"
                                    selectionMode="multiple"
                                    selectedKeys={selectedDriverKeys}
                                    onSelectionChange={(keys) => handleChange(keys)}
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
                        key={`breadcrumb-lap`}
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

export default TelemetryBreadcrumbs;
