// @/components/Telemetry/SelectionPrompts/SelectionPrompt.tsx

import React from "react";
import { Listbox, ListboxItem, Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { useTelemetry } from "@/context/TelemetryContext";

interface SelectionPromptProps {
    label: string;
    icon: JSX.Element;
    data: string[] | MeetingParams[] | SessionParams[];
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
                        data={data as MeetingParams[]}
                        itemKey="meeting_key"
                        handler={(value) => setSelectedMeetingKey(parseInt(value))}
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
                        data={data as SessionParams[]}
                        itemKey="session_key"
                        handler={(value) => setSelectedSessionKey(parseInt(value))}
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
    selectedValue: any;
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
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data}>
                {(item: T) => {
                    const itemKeyValue = item[itemKey]?.toString();
                    return (
                        <TableRow key={itemKeyValue} onClick={() => handler(itemKeyValue!)}>
                            {headers.map((header) => (
                                <TableCell key={header.key}>
                                    {item[header.key]}
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
        <div className="">
            <RadioGroup
                aria-label="Year Selection"
                color="primary"
                value={selectedValue}
                onValueChange={handler}
            >
                {data.map((year) => (
                    <Radio key={year} value={year}>
                        {year}
                    </Radio>
                ))}
            </RadioGroup>
        </div>
    );
};
