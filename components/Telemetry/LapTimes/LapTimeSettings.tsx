// @/components/Telemetry/LapTimeSettings.tsx

import { Input, Popover, PopoverTrigger, PopoverContent, Switch, Divider, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Select, SelectItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Cog, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface LapTimeSettingsProps {
    isRaceControl: boolean;
    setIsRaceControl: (value: boolean) => void;
    isTyres: boolean;
    setIsTyres: (value: boolean) => void;
    isOutlierDetection: boolean;
    setIsOutlierDetection: (value: boolean) => void;
    outlierMethod: string;
    setOutlierMethod: (value: string) => void;
    customLowerThreshold: number;
    setCustomLowerThreshold: (value: number) => void;
    customUpperThreshold: number;
    setCustomUpperThreshold: (value: number) => void;
    defaultThresholds: [number, number];
    iqrMultiplier: number;
    setIqrMultiplier: (value: number) => void;
    zscoreThreshold: number;
    setZscoreThreshold: (value: number) => void;
    modZscoreThreshold: number;
    setModZscoreThreshold: (value: number) => void;
}

const LapTimeSettings: React.FC<LapTimeSettingsProps> = ({
    isRaceControl,
    setIsRaceControl,
    isTyres,
    setIsTyres,
    isOutlierDetection,
    setIsOutlierDetection,
    outlierMethod,
    setOutlierMethod,
    customLowerThreshold,
    setCustomLowerThreshold,
    customUpperThreshold,
    setCustomUpperThreshold,
    defaultThresholds,
    iqrMultiplier,
    setIqrMultiplier,
    zscoreThreshold,
    setZscoreThreshold,
    modZscoreThreshold,
    setModZscoreThreshold
}) => {
    const methods = [
        { key: "iqr", label: "Interquartile Range" },
        { key: "z-score", label: "Z-Score" },
        { key: "mod-z-score", label: "Modified Z-Score" },
        { key: "chauvenet", label: "Chauvenet's Criterion" }
    ];

    const renderOutlierMethod = () => {
        switch (outlierMethod) {
            case "z-score":
                return (
                    <Input
                        label="Z-Score Threshold"
                        type="number"
                        value={zscoreThreshold.toString()}
                        isClearable
                        onClear={() => setZscoreThreshold(3)}
                        isInvalid={zscoreThreshold < 0}
                        errorMessage="Value must be greater than zero"
                        onChange={(e) => setZscoreThreshold(Number.parseFloat(e.target.value))}
                        size="sm"
                    />
                )
            case "mod-z-score":
                return (
                    <Input
                        label="Modified Z-Score Threshold"
                        type="number"
                        value={modZscoreThreshold.toString()}
                        isClearable
                        onClear={() => setModZscoreThreshold(3)}
                        isInvalid={modZscoreThreshold < 0}
                        errorMessage="Value must be greater than zero"
                        onChange={(e) => setModZscoreThreshold(Number.parseFloat(e.target.value))}
                        size="sm"
                    />
                )
            case "chauvenet":
                return (
                    <p>no changes</p>
                )
            default:
                return (
                    <Input
                        label="IQR Multiplier"
                        type="number"
                        value={iqrMultiplier.toString()}
                        isClearable
                        onClear={() => setIqrMultiplier(1.5)}
                        isInvalid={iqrMultiplier < 0}
                        errorMessage="Value must be greater than zero"
                        onChange={(e) => setIqrMultiplier(Number.parseFloat(e.target.value))}
                        size="sm"
                    />
                )
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="align-middle">
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="flat"
                    onPress={onOpen}
                    isIconOnly
                    className="capitalize"
                >
                    <Cog className="rotate-0 hover:rotate-180 transition-transform duration-700 ease-in-out" />
                </Button>
            </div>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onClose={onClose}
                className="border border-default/75 bg-"
                radius="sm"
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                                opacity: { duration: 1 },
                                scale: { duration: 0.4, ease: "easeOut" }
                            }
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.8,
                            transition: {
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2, ease: "easeOut" }
                            }
                        }
                    }
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <div className="px-1 py-2 flex flex-col font-thin gap-2">
                                    <Switch
                                        isSelected={isRaceControl}
                                        onValueChange={setIsRaceControl}
                                        size="sm"
                                    >
                                        Race Control
                                    </Switch>
                                    <Switch
                                        isSelected={isTyres}
                                        onValueChange={setIsTyres}
                                        size="sm"
                                    >
                                        Tyres
                                    </Switch>
                                    <Divider />
                                    <Switch
                                        isSelected={isOutlierDetection}
                                        onValueChange={setIsOutlierDetection}
                                        size="sm"
                                    >
                                        Outlier Detection
                                    </Switch>
                                    {isOutlierDetection && (
                                        <>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button
                                                        variant="ghost"
                                                        color="primary"
                                                        className="capitalize rounded-small"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {methods.find(method => method.key === outlierMethod)?.label} <ChevronDown className="ml-auto" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    aria-label={`Outlier Method Selection`}
                                                    variant="solid"
                                                    color="primary"
                                                    selectionMode="single"
                                                    onAction={(key) => {
                                                        setOutlierMethod(key.toString());
                                                    }}
                                                    selectedKeys={[outlierMethod]}
                                                    items={methods}
                                                >
                                                    {(item) => (
                                                        <DropdownItem key={item.key}>{item.label}</DropdownItem>
                                                    )}
                                                </DropdownMenu>
                                            </Dropdown>
                                            <Input
                                                label="Lower Threshold"
                                                type="number"
                                                value={
                                                    customLowerThreshold !== -1
                                                        ? customLowerThreshold.toString()
                                                        : defaultThresholds[0].toString()
                                                }
                                                isClearable
                                                onClear={() => setCustomLowerThreshold(-1)}
                                                onChange={(e) =>
                                                    setCustomLowerThreshold(parseFloat(e.target.value))
                                                }
                                                size="sm"
                                            />
                                            <Input
                                                label="Upper Threshold"
                                                type="number"
                                                value={
                                                    customUpperThreshold !== -1
                                                        ? customUpperThreshold.toString()
                                                        : defaultThresholds[1].toString()
                                                }
                                                isClearable
                                                onClear={() => setCustomUpperThreshold(-1)}
                                                onChange={(e) =>
                                                    setCustomUpperThreshold(parseFloat(e.target.value))
                                                }
                                                size="sm"
                                            />
                                            {renderOutlierMethod()}
                                        </>
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default LapTimeSettings;