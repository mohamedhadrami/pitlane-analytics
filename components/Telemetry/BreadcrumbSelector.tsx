// @/components/Telemetry2/BreadcrumbSelector.tsx

"use client"

import type React from "react";
import type { OFMeeting, OFSession } from "@/types/openF1.types";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, type Selection } from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";

type SelectorLabel = "year" | "meeting" | "session";

type ValueMap = {
    year: string;
    meeting: OFMeeting;
    session: OFSession;
};

type SelectorProps<L extends SelectorLabel> = {
    label: L;
    values: ValueMap[L][] | null;
    onChange: (value: ValueMap[L], label: L) => void;
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
    onChange,
    displayValue,
    disabled = false,
}: SelectorProps<L>) => {

    const organizedValues = organizeValues(label, values, disabled);
    const selectedKeys = displayValue(label);

    const handleChange = (keys: Selection) => {
        if (keys === "all") return;
        const chosenValue = Array.from(keys)[0];
        if (!chosenValue) return;
        onChange(chosenValue as ValueMap[L], label);
    };

    return (
        <>
            <Dropdown
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
        </>
    )
}

export default BreadcrumbSelector;