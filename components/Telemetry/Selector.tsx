// @/components/Telemetry/Selector.tsx

"use client"

import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import React from "react";

interface SelectorProps {
    id: string;
    label: string;
    values: any[] | null;
    onChange: (value: any, name: any) => void;
    displayValue: (label: string | undefined) => string | undefined;
    disabled?: boolean;
}

const organizeValues = (label: string, values: any[] | null, isDisabled: boolean) => {
    let verifiedValues: any[] = [];
    if (values == null) return values;
    if (isDisabled) return values;
    switch (label) {
        case "year":
            verifiedValues = values;
            break;
        case "meeting":
            values.forEach((value: MeetingParams) => {
                verifiedValues.push(value.meeting_official_name);
            })
            break;
        case "session":
            values.forEach((value: SessionParams) => {
                verifiedValues.push(value.session_name);
            })
            break;
    }
    return verifiedValues;
}

const Selector: React.FC<SelectorProps> = ({
    id,
    label,
    values,
    onChange,
    displayValue,
    disabled = false,
}) => {

    const handleChange = (e: any) => {
        let chosenValue = [...e][0];
        onChange(chosenValue, label);
    };

    const organizedValues = organizeValues(label, values, disabled);

    const selectedKeys = displayValue(label);

    return (
        <>
            <Dropdown
                backdrop="blur"
                isDisabled={disabled}>
                <DropdownTrigger>
                    <Button
                        variant="solid"
                        color="primary"
                        className="capitalize rounded-small"
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

export default Selector;