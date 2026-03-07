// @/components/Telemetry/SelectionPrompts/SelectionPrompt.tsx

<<<<<<< HEAD
import React from "react";
import { Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
=======
import type React from "react";
import type { JSX } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { parseISODateAndTime, parseSessionDateTime } from "@/utils/helpers";
import type { OFMeeting, OFSession } from "@/types/openF1.types";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c

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
<<<<<<< HEAD
                        selectedValue={selectedYear!}
=======
                        selectedValue={selectedYear}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                        handler={setSelectedYear}
                    />
                );
            case "Meeting":
                return (
                    <DataTable<OFMeeting>
                        headers={[
                            { key: "meeting_key", label: "Meeting Key" },
                            { key: "meeting_name", label: "Meeting Name" },
                            { key: "circuit_short_name", label: "Circuit Name" },
                            { key: "country_name", label: "Country" },
                            { key: "date_start", label: "Start Date" },
                            { key: "year", label: "Year" },
                        ]}
<<<<<<< HEAD
                        selectedValue={selectedMeetingKey!}
                        data={data as MeetingParams[]}
                        itemKey="meeting_key"
                        handler={(value) => setSelectedMeetingKey(parseInt(value))}
=======
                        selectedValue={selectedMeetingKey}
                        data={data as OFMeeting[]}
                        itemKey="meeting_key"
                        handler={(value) => setSelectedMeetingKey(Number.parseInt(value))}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                    />
                );
            case "Session":
                return (
                    <DataTable<OFSession>
                        headers={[
                            { key: "session_key", label: "Session Key" },
                            { key: "session_name", label: "Session Name" },
                            { key: "session_type", label: "Session Type" },
                            { key: "circuit_short_name", label: "Circuit Name" },
                            { key: "date_start", label: "Start Date" },
                            { key: "date_end", label: "End Date" },
                        ]}
<<<<<<< HEAD
                        selectedValue={selectedSessionKey!}
                        data={data as SessionParams[]}
                        itemKey="session_key"
                        handler={(value) => setSelectedSessionKey(parseInt(value))}
=======
                        selectedValue={selectedSessionKey}
                        data={data as OFSession[]}
                        itemKey="session_key"
                        handler={(value) => setSelectedSessionKey(Number.parseInt(value))}
                        formatters={{
                            date_start: (val) =>
                                typeof val === "string" ? parseSessionDateTime(val) : "",
                            date_end: (val) =>
                                typeof val === "string" ? parseSessionDateTime(val) : "",
                        }}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full gap-5">
            <div className="flex flex-row items-center gap-3">
                <div>{icon}</div>
                <div className="font-extralight text-xl">Select a {label}</div>
            </div>
            <div className="flex flex-col">{renderDataContent()}</div>
        </div>
<<<<<<< HEAD

=======
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
    );
};

export default SelectionPrompt;

// Abstract DataTable component
interface DataTableProps<T> {
    headers: { key: keyof T; label: string }[];
<<<<<<< HEAD
    selectedValue: any;
    data: T[];
    handler: (item: string) => void;
    itemKey: keyof T;
=======
    selectedValue: number | undefined;
    data: T[];
    handler: (item: string) => void;
    itemKey: keyof T;
    gmtOffset?: string;
    formatters?: Partial<
        Record<keyof T, (value: string | number | undefined) => string>
    >;
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
}

const DataTable = <T extends object>({
    headers,
    selectedValue,
    data,
    handler,
<<<<<<< HEAD
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
                    const itemKeyValue = item[itemKey]?.toString();
                    return (
                        <TableRow key={itemKeyValue} onClick={() => handler(itemKeyValue!)}>
                            {headers.map((header) => (
                                <TableCell key={String(header.key)}>
                                    {String(item[header.key])}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                }}
=======
    itemKey,
    gmtOffset,
    formatters,
}: DataTableProps<T>) => {
    const selectedKeyString = selectedValue?.toString() || "";

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((column) => (
                        <TableHead key={String(column.key)}>{column.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => {
                    const key =
                        typeof item[itemKey] === "string" || typeof item[itemKey] === "number"
                            ? String(item[itemKey])
                            : headers.map((h) => String(item[h.key])).join("-");

                    return (
                        <TableRow
                            key={key}
                            data-state={selectedKeyString === key ? "selected" : undefined}
                            onClick={() => handler(key)}
                            className="cursor-pointer"
                        >
                            {headers.map((header) => {
                                const rawValue = item[header.key];
                                const formatter = formatters?.[header.key];

                                let displayValue: string;

                                if (formatter && (typeof rawValue === "string" || typeof rawValue === "number" || typeof rawValue === "undefined")) {
                                    displayValue = formatter(rawValue);
                                } else {
                                    displayValue = String(rawValue ?? "");
                                }

                                return (
                                    <TableCell key={String(header.key)}>{displayValue}</TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
            </TableBody>
        </Table>
    );
};



interface YearDataProps {
    data: string[];
<<<<<<< HEAD
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
=======
    selectedValue: string | undefined;
    handler: (year: string) => void;
}

const YearData: React.FC<YearDataProps> = ({
    data,
    selectedValue,
    handler,
}) => {
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
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
    );
};
