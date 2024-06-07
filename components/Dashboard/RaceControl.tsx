import { useEffect, useState } from "react";
import { DriverParams, RaceControlParams, SessionParams } from "../../interfaces/openF1";
import { driverImage, parseISOTimeFull } from "../../utils/helpers";
import { fetchSession } from "../../services/openF1Api";
import { Image, ScrollShadow } from "@nextui-org/react";
import { useLiveSettings } from "@/context/LiveSettingsContext";

const RaceControl: React.FC<{ drivers: DriverParams[], raceControl: RaceControlParams[] }> = ({ drivers, raceControl }) => {
    const { settings } = useLiveSettings();
    const findSetting = (name: string) => settings.find(setting => setting.name === name);
    const isShowRaceControlTime = findSetting('Show Race Control Time')?.value;
    const isShowBlueFlag = findSetting('Show Blue Flag')?.value;
    
    const [gmtOffset, setGmtOffset] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffset = async () => {
            const params: SessionParams = {
                session_key: raceControl[0]?.session_key
            }
            const apiData = await fetchSession(params);
            setGmtOffset(apiData[0]?.gmt_offset)
        }
        fetchOffset();
    }, [raceControl]);

    const driverData = (driver_number: number) => {
        const driver: DriverParams | undefined = drivers?.find(driver => driver.driver_number === driver_number);
        if (driver) return [driver?.first_name, driver?.last_name]
        else return [undefined, undefined]
    }

    // Sort the raceControl array by date in descending order
    const sortedRaceControl = raceControl.sort((a, b) => Date.parse(b.date!) - Date.parse(a.date!));

    const filteredRaceControl = isShowBlueFlag 
        ? sortedRaceControl 
        : sortedRaceControl.filter(event => event.flag !== "BLUE");

    return (
        <div className="overflow-y-scroll">
            <div className="m-3 min-w-[400px] font-extralight">
                <ScrollShadow className="min-w-[300px] h-[400px]" size={50}>
                    {filteredRaceControl && filteredRaceControl.map((event: RaceControlParams, id: number) => (
                        <div key={`${event.date}-${event.category}-${id}`} className="flex items-center my-1">
                            {isShowRaceControlTime && gmtOffset && (
                                <div className="text-[#999] font-extralight w-[12%] text-left">
                                    {parseISOTimeFull(event?.date, gmtOffset)}
                                </div>
                            )}
                            <div className="flex items-center w-3/4 text-left font-extralight">
                                {event.flag && event.flag !== "CLEAR" && (
                                    <Image
                                        src={`flags/${event.flag}.png`}
                                        alt={`${event.flag}`}
                                        className="w-5 mr-3 rounded-sm" />
                                )}
                                {event.category && event.category === "SafetyCar" && (
                                    <Image
                                        src={`flags/SC.png`}
                                        alt={`${event.flag}`}
                                        className="w-5 mr-3" />
                                )}
                                {event.driver_number && drivers && (
                                    <Image
                                        src={driverImage(`${driverData(event.driver_number)[0]} ${driverData(event.driver_number)[1]}`)}
                                        alt={`driver-${event.driver_number}`}
                                        className="w-8 rounded-full" />
                                )}
                                <p className="m-0">{event.message}</p>
                            </div>
                        </div>
                    ))}
                </ScrollShadow>
            </div>
        </div>
    );
};

export default RaceControl;
