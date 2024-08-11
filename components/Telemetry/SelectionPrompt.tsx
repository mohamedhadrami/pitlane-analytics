// @/components/Telemetry/SelectionPrompts/SelectionPrompt.tsx

import React from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";

interface SelectionPromptProps {
    label: string;
    icon: JSX.Element;
    data: string[] | MeetingParams[] | SessionParams[];
}

const SelectionPrompt: React.FC<SelectionPromptProps> = ({ label, icon, data }) => {
    const renderDataContent = () => {
        switch (label) {
            case "Year":
                return <YearData data={data as string[]} />;
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
                        data={data as MeetingParams[]}
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
                        data={data as SessionParams[]}
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
    data: T[];
}

const DataTable = <T extends object>({ headers, data }: DataTableProps<T>) => {
    return (
        <Table>
            <TableHeader columns={headers}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data}>
                {(item: T) => (
                    <TableRow key={(item as any).key || Object.values(item).join("-")}>
                        {headers.map((header) => (
                            <TableCell key={header.key}>
                                {item[header.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

// YearData component remains the same
const YearData: React.FC<{ data: string[] }> = ({ data }) => {
    return (
        <div>
            {data.map((year, index) => (
                <p key={index}>{year}</p>
            ))}
        </div>
    );
};
