
import { driverImage, parseISOTimeFull } from "../../utils/helpers";
import { Image, ScrollShadow } from "@nextui-org/react";
import { useLiveSettings } from "@/context/LiveSettingsContext";
import { LiveDriver, LiveDriverList, LiveRaceControlMessage, LiveRaceControlMessages } from "@/interfaces/liveTiming.type";
import { useEffect, useState } from "react";

const RaceControl: React.FC<{ drivers: LiveDriverList, rawRaceControl: LiveRaceControlMessages, gmtOffset: string }> = ({ drivers, rawRaceControl, gmtOffset }) => {
    const { settings } = useLiveSettings();
    const findSetting = (name: string) => settings.find(setting => setting.name === name);
    const isShowRaceControlTime = findSetting('Show Race Control Time')?.value;
    const isShowBlueFlag = findSetting('Show Blue Flag')?.value;

    const [filteredRaceControl, setFilteredRaceControl] = useState<LiveRaceControlMessage[]>()

    useEffect(() => {
        if (rawRaceControl) {
            const sortedRaceControl = rawRaceControl.Messages.sort((a, b) => Date.parse(b.Utc!) - Date.parse(a.Utc!));
            const data = isShowBlueFlag
                ? sortedRaceControl
                : sortedRaceControl.filter((event: LiveRaceControlMessage) => event.Flag !== "BLUE");

            setFilteredRaceControl(data)
        }
    }, [rawRaceControl, isShowBlueFlag])

    const driverData = (driver_number: string) => {
        const driver: LiveDriver | undefined = drivers[driver_number]
        if (driver) return [driver?.FirstName, driver?.LastName]
        else return [undefined, undefined]
    }

    return (
        <div className="overflow-y-scroll">
            <div className="m-3 min-w-[400px] font-extralight">
                <ScrollShadow className="min-w-[300px] h-[400px]" size={50}>
                    {filteredRaceControl && filteredRaceControl.map((event: LiveRaceControlMessage, id: number) => (
                        <div key={`${event.Utc}-${event.Category}-${id}`} className="flex items-center my-1">
                            {isShowRaceControlTime && gmtOffset && (
                                <div className="text-[#999] font-extralight w-[12%] text-left">
                                    {parseISOTimeFull(event?.Utc, gmtOffset)} Lap {event.Lap}
                                </div>
                            )}
                            <div className="flex items-center w-3/4 text-left font-extralight">
                                {event.Flag && event.Flag !== "CLEAR" && (
                                    <Image
                                        src={`flags/${event.Flag}.png`}
                                        alt={`${event.Flag}`}
                                        className="w-5 mr-3 rounded-sm" />
                                )}
                                {event.Category && event.Category === "SafetyCar" && (
                                    <Image
                                        src={`flags/SC.png`}
                                        alt={`${event.Flag}`}
                                        className="w-5 mr-3" />
                                )}
                                {event.RacingNumber && drivers && (
                                    <Image
                                        src={driverImage(`${driverData(event.RacingNumber)[0]} ${driverData(event.RacingNumber)[1]}`)}
                                        alt={`driver-${event.RacingNumber}`}
                                        className="w-8 rounded-full" />
                                )}
                                <p className="m-0">{event.Message}</p>
                            </div>
                        </div>
                    ))}
                </ScrollShadow>
            </div>
        </div>
    );
};

export default RaceControl;
