// @/components/Telemetry/SelectionPrompts/SelectionPrompt.tsx

import type React from "react";
import type { JSX } from "react";
import { Listbox, ListboxItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import type { OFMeeting, OFSession } from "@/types/openF1.types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";

interface SelectionPromptProps {
    label: string;
    icon: JSX.Element;
    data: string[] | OFMeeting[] | OFSession[];
    selectedValue?: string;
    setData?: (data: string) => void;
}

const SelectionPrompt: React.FC<SelectionPromptProps> = ({ label, icon, data }) => {
    const {
        selectedYear, setSelectedYear,
        selectedMeetingKey, setSelectedMeetingKey,
        selectedSessionKey, setSelectedSessionKey
    } = useTelemetry();

    const renderDataContent = () => {
        switch (label) {
            case "Year":
                return (
                    <YearData
                        data={data as string[]}
                        selectedValue={selectedYear!}
                        handler={setSelectedYear}
                    />
                );
            case "Meeting":
                return (
                    <DataTable
                        headers={[
                            { key: "meeting_key", label: "Meeting Key" },
                            { key: "meeting_name", label: "Meeting Name" },
                            { key: "circuit_short_name", label: "Circuit Name" },
                            { key: "country_name", label: "Country" },
                            { key: "date_start", label: "Start Date" },
                            { key: "year", label: "Year" },
                        ]}
                        selectedValue={selectedMeetingKey!}
                        data={data as OFMeeting[]}
                        itemKey="meeting_key"
                        handler={(value) => setSelectedMeetingKey(Number.parseInt(value))}
                    />
                );
            case "Session":
                return (
                    <DataTable
                        headers={[
                            { key: "session_name", label: "Session Name" },
                            { key: "session_type", label: "Session Type" },
                            { key: "circuit_short_name", label: "Circuit Name" },
                            { key: "date_start", label: "Start Date" },
                            { key: "date_end", label: "End Date" },
                        ]}
                        selectedValue={selectedSessionKey!}
                        data={data as OFSession[]}
                        itemKey="session_key"
                        handler={(value) => setSelectedSessionKey(Number.parseInt(value))}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={label}
                initial={{ x: 0, y: 300, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: 0, y: -300, opacity: 0 }}
                className="flex flex-col items-center justify-center w-full gap-5"
            >
                <div className="flex flex-row items-center gap-3">
                    <div>{icon}</div>
                    <div className="font-extralight text-xl">Select a {label}</div>
                </div>
                <div className="flex flex-col">{renderDataContent()}</div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SelectionPrompt;

// Abstract DataTable component
interface DataTableProps<T> {
    headers: { key: keyof T; label: string }[];
    selectedValue: number;
    data: T[];
    handler: (item: string) => void;
    itemKey: keyof T;  // The key to use for each row
}

const DataTable = <T extends object>({
    headers,
    selectedValue,
    data,
    handler,
    itemKey
}: DataTableProps<T>) => {
    const selectedKeyString = selectedValue?.toString() || '';

    return (
        <Table
            color="primary"
            selectionMode="single"
            removeWrapper
            selectedKeys={new Set([selectedKeyString])}
        >
            <TableHeader columns={headers}>
                {(column) => <TableColumn key={String(column.key)}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data}>
                {(item: T) => {
                    const key =
                        "key" in item && typeof item.key === "string"
                            ? (item.key as string)
                            : headers.map((h) => String(item[h.key])).join("-");
                    return (
                        <TableRow key={key} onClick={() => handler(key)}>
                            {headers.map((header) => (
                                <TableCell key={String(header.key)}>
                                    {String(item[header.key])}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                }}
            </TableBody>
        </Table>
    );
};


interface YearDataProps {
    data: string[];
    selectedValue: string;
    handler: (year: string) => void;
}

// YearData component
const YearData: React.FC<YearDataProps> = ({ data, selectedValue, handler }) => {
    return (
        <RadioGroup
            aria-label="Year Selection"
            onValueChange={handler}
            value={selectedValue}
        >
            {data.map((year: string) => (
                <div key={year} className="flex items-center space-x-2">
                    <RadioGroupItem value={year} id={year} />
                    <p>{year}</p>
                </div>
            ))}
        </RadioGroup>
    );
};
