// @/components/Telemetry2/BreadcrumbSelector.tsx

"use client"

import { MeetingParams, SessionParams } from "@/interfaces/openF1";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SelectorProps {
    id: string;
    label: string;
    values: any[] | null;
    icon: JSX.Element;
    onChange: (value: any, name: any) => void;
    displayValue: (selectedValue: any) => string | undefined;
    selectedValue: any;
    disabled?: boolean;
}

const organizeValues = (label: string, values: any[] | null, isDisabled: boolean) => {
    let verifiedValues: any[] = [];
    if (!values || isDisabled) return verifiedValues;
    
    switch (label) {
        case "year":
            values.forEach((value) => {
                verifiedValues.push({
                    key: value,
                    value: value
                });
            });
            break;
        case "meeting":
            values.forEach((value: MeetingParams) => {
                verifiedValues.push({
                    key: value.meeting_key,
                    value: value.meeting_name
                });
            });
            break;
        case "session":
            values.forEach((value: SessionParams) => {
                verifiedValues.push({
                    key: value.session_key,
                    value: value.session_name
                });
            });
            break;
        default:
            break;
    }
    return verifiedValues;
}

const BreadcrumbSelector: React.FC<SelectorProps> = ({
    id,
    label,
    values,
    icon,
    onChange,
    displayValue,
    selectedValue,
    disabled = false,
}) => {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const organizedValues = organizeValues(label, values, disabled);

    useEffect(() => {
        if (selectedValue) {
            setSelectedKeys(new Set([selectedValue.toString()]));
        }
    }, [selectedValue]);

    const handleChange = (e: any) => {
        const chosenValue = [...e][0];
        onChange(chosenValue, label);
        setSelectedKeys(new Set([chosenValue]));
    };

    const selectedDisplayValue = displayValue(label);

    return (
        <Dropdown
            backdrop="opaque"
            isDisabled={disabled}
            shouldBlockScroll={false}
        >
            <DropdownTrigger>
                <Button
                    variant="light"
                    color="default"
                    size="sm"
                    radius="sm"
                    startContent={icon}
                    endContent={<ChevronDownIcon className="text-default-500" />}
                    className="flex items-center capitalize font-extralight"
                >
                    {selectedDisplayValue || `Select ${label}`}
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
                    {organizedValues.map((data) => (
                        <DropdownItem key={data.key}>{data.value}</DropdownItem>
                    ))}
                </DropdownMenu>
            )}
        </Dropdown>
    );
}

export default BreadcrumbSelector;
