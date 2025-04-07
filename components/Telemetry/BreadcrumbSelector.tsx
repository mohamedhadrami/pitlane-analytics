// @/components/Telemetry2/BreadcrumbSelector.tsx

"use client"

import type React from "react";
import type { OFMeeting, OFSession } from "@/types/openF1.types";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, type Selection } from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { type JSX, useEffect } from "react";

type SelectorLabel = "year" | "meeting" | "session";

type ValueMap = {
    year: string;
    meeting: OFMeeting;
    session: OFSession;
};

type SelectorProps<L extends SelectorLabel> = {
    label: L;
    values: ValueMap[L][] | null;
    icon: JSX.Element;
    onChange: (value: string, label: L) => void;
    displayValue: (label: string | undefined) => string | undefined;
    disabled?: boolean;
};

const organizeValues = <L extends SelectorLabel>(
    label: L,
    values: ValueMap[L][] | null,
    isDisabled: boolean
): string[] | null => {
    if (!values || isDisabled) return null;

    switch (label) {
        case "meeting":
            return (values as OFMeeting[]).map((v) => v.meeting_official_name);
        case "session":
            return (values as OFSession[]).map((v) => v.session_name);
        //case "year":
        default:
            return values as string[];
    }
};


const BreadcrumbSelector = <L extends SelectorLabel>({
    label,
    values,
    icon,
    onChange,
    displayValue,
    disabled = false,
}: SelectorProps<L>) => {

    const organizedValues = organizeValues(label, values, disabled);
    const selectedKeys = displayValue(label);

    const placeholderMap: Record<SelectorLabel, string> = {
        year: "Select a year",
        meeting: "Select a race",
        session: "Select a session",
    };

    return (
        <>
            {label && organizedValues && (
                <Select
                    aria-label={`${label} selection`}
                    value={selectedKeys}
                    onValueChange={(e) => onChange(e, label)}
                    required
                >
                    <SelectTrigger className="max-w-xs overflow-hidden truncate whitespace-nowrap" icon={icon}>
                        <div className="truncate w-full text-left text-white font-extralight">
                            <SelectValue placeholder={placeholderMap[label]} />
                        </div>
                    </SelectTrigger>
                    {organizedValues && organizedValues.length > 0 && (
                        <SelectContent className="max-h-96">
                            {organizedValues.map((value) => (
                                <SelectItem key={value} value={value}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    )}
                </Select>
            )}
        </>
    )
}

export default BreadcrumbSelector;

/**
 *  <Dropdown
                backdrop="blur"
                isDisabled={disabled}
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
                        {label ? displayValue(label) : ''}
                    </Button>
                </DropdownTrigger>
                {organizedValues && organizedValues.length > 0 && (
                    <DropdownMenu
                        aria-label={`${label} selection`}
                        variant="solid"
                        color="primary"
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={handleChange}
                    >
                        {organizedValues.map((value) => (
                            <DropdownItem key={value}>{value}</DropdownItem>
                        ))}
                    </DropdownMenu>
                )}
            </Dropdown>
 */