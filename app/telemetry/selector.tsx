"use client"

import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import React from "react";

interface SelectorProps {
    id: string;
    label: string;
    values: any[] | null;
    onChange: (value: any) => void;
    value: any;
    disabled?: boolean;
}

const organizeValues = (label: string, values: any[] | null) => {
    let verifiedValues: any[] = [];
    if (values == null) return values;
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
    value,
    disabled = false,
}) => {

    const handleChange = (e: any) => {
        const value = [...e][0]
        onChange(value)
    };

    const organizedValues = organizeValues(label, values);

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
                        {value ? value : `Select a ${label}`}
                    </Button>
                </DropdownTrigger>
                {values && values.length > 0 && (
                    <DropdownMenu
                        aria-label="Year selection"
                        variant="solid"
                        color="primary"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={value}
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