// app/dashboard/LiveSettings.tsx
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionItem, Switch, Input } from "@nextui-org/react";
import { Cog, Headset, Info, ListOrdered, TowerControl } from "lucide-react";
import { LiveSetting, useLiveSettings } from "./LiveSettingsContext";

const LiveSettings: React.FC = () => {
    const { settings } = useLiveSettings();

    // Group settings by category
    const groupedSettings = settings.reduce((acc: { [key: string]: LiveSetting<any>[] }, setting) => {
        if (!acc[setting.category]) {
            acc[setting.category] = [];
        }
        acc[setting.category].push(setting);
        return acc;
    }, {});

    return (
        <Sheet>
            <SheetTrigger className="my-auto"><Cog /></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <h2 className="font-thin text-2xl">Dashboard Settings</h2>
                </SheetHeader>
                <Accordion
                    variant="light"
                    motionProps={{
                        variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                height: "auto",
                                transition: {
                                    height: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        duration: 1,
                                    },
                                    opacity: {
                                        easings: "ease",
                                        duration: 1,
                                    },
                                },
                            },
                            exit: {
                                y: -10,
                                opacity: 0,
                                height: 0,
                                transition: {
                                    height: {
                                        easings: "ease",
                                        duration: 0.25,
                                    },
                                    opacity: {
                                        easings: "ease",
                                        duration: 0.3,
                                    },
                                },
                            },
                        },
                    }}
                >
                    {Object.keys(groupedSettings).map((category) => (
                        <AccordionItem
                            key={category}
                            aria-label={category}
                            title={capitalizeCategory(category)}
                            startContent={getCategoryIcon(category)}
                        >
                            {groupedSettings[category].map((setting) => (
                                <div key={setting.name} className="py-2">
                                    {renderSettingControl(setting)}
                                </div>
                            ))}
                        </AccordionItem>
                    ))}
                </Accordion>
            </SheetContent>
        </Sheet>
    );
};

const renderSettingControl = (setting: LiveSetting<any>) => {
    switch (setting.type) {
        case 'boolean':
            return (
                <Switch
                    isSelected={setting.value}
                    onValueChange={(e) => setting.setValue(e)}
                    size="sm"
                >
                    {setting.name}
                </Switch>
            );
        case 'string':
            return (
                <Input
                    value={setting.value}
                    onChange={(e) => setting.setValue(e.target.value)}
                    size="sm"
                    placeholder="Enter value"
                />
            );
        case 'number':
            return (
                <Input
                    type="number"
                    value={setting.value}
                    onChange={(e) => setting.setValue(Number(e.target.value))}
                    size="sm"
                    placeholder="Enter value"
                />
            );
        default:
            return null;
    }
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'stats-banner':
            return <Info className="mx-2" />;
        case 'live-table':
            return <ListOrdered className="mx-2" />;
        case 'race-control':
            return <TowerControl className="mx-2" />;
        case 'team-radio':
            return <Headset className="mx-2" />;
        default:
            return <Cog className="mx-2" />;
    }
};

const capitalizeCategory = (category: string) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

export default LiveSettings;
