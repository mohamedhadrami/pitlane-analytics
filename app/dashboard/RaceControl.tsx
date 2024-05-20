import { useEffect, useState } from "react";
import { DriverParams, RaceControlParams, SessionParams } from "../../interfaces/openF1";
import { driverImage, parseISOTimeFull } from "../../utils/helpers";
import { fetchSession } from "../../services/openF1Api";
import { Image } from "@nextui-org/react";

const RaceControl: React.FC<{ drivers: DriverParams[], raceControl: RaceControlParams[] }> = ({ drivers, raceControl }) => {
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
        const driver = drivers?.find(driver => driver.driver_number === driver_number);
        if (driver) return [driver?.first_name, driver?.last_name]
        else return [undefined, undefined]
    }

    // Sort the raceControl array by date in descending order
    const sortedRaceControl = raceControl.sort((a, b) => Date.parse(b.date!) - Date.parse(a.date!));

    return (
        <div style={{ scrollbarWidth: "none" }} className="overflow-y-scroll h-[50vh]">
            <div className="m-3 min-w-[400px] font-extralight">
                <div>
                    {sortedRaceControl && sortedRaceControl.map((event: RaceControlParams, id: number) => (
                        <div key={`${event.date}-${event.category}-${id}`} className="flex items-center my-1">
                            {gmtOffset && (
                                <div className="text-[#999] font-extralight w-1/4 text-left">
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
                </div>
            </div>
        </div>
    );
};

export default RaceControl;
