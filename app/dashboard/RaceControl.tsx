

import { useEffect, useState } from "react";
import { DriverParams, RaceControlParams, SessionParams } from "../../interfaces/openF1";
import { driverImage, parseISOTimeFull } from "../../utils/helpers";
import { fetchSession } from "../../services/openF1Api";

const RaceControl: React.FC<{ drivers: DriverParams[], raceControl: RaceControlParams[] }> = ({ drivers, raceControl }) => {
    const [gmtOffset, setGmtOffset] = useState(null);

    useEffect(() => {
        const fetchOffset = async () => {
            const params: SessionParams = {
                session_key: raceControl[0]?.session_key
            }
            const apiData = await fetchSession(params);
            setGmtOffset(apiData[0]?.gmt_offset)
        }
        fetchOffset();
    }, [raceControl])

    const driverData = (driver_number: number) => {
        const driver = drivers?.find(driver => driver.driver_number === driver_number);
        console.log(driver)
        if (driver) return [driver?.first_name, driver?.last_name]
        else return [undefined, undefined]
    }

    return (
        <div style={{ scrollbarWidth: "none" }}
            className="overflow-y-scroll h-[50vh]">
            <div className="m-3 min-w-[400px] font-extralight">
                <table>
                    {raceControl && raceControl.map((event: RaceControlParams, id: number) => (
                        <tr key={`${event.date}-${event.category}-${id}`} className="flex items-center my-1">
                            {gmtOffset && (
                                <th className="text-[#999] font-extralight w-1/4 text-left">
                                    {parseISOTimeFull(event?.date, gmtOffset)}
                                </th>
                            )}
                            <th className="flex items-center w-3/4 text-left font-extralight">
                                {event.flag && event.flag !== "CLEAR" && (
                                    <img
                                        src={`flags/${event.flag}.png`}
                                        alt={`${event.flag}`}
                                        className="w-5 mr-3 border-solid border-1 border-white" />
                                )}
                                {event.category && event.category === "SafetyCar" && (
                                    <img
                                        src={`flags/SC.png`}
                                        alt={`${event.flag}`}
                                        className="w-5 mr-3" />
                                )}
                                {event.driver_number && drivers && (
                                    <div>h</div>
                                )}
                                <p className="m-0">{event.message}</p>
                            </th>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
};

export default RaceControl;

/**
 <img
    src={driverImage(driverData(event.driver_number)[0], driverData(event.driver_number)[1])}
    alt={`driver-${event.driver_number}`}
    className="w-6 rounded-full" />
                                
 */