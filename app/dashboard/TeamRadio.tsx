
import React, { useEffect, useRef, useState } from "react";
import { DriverParams, SessionParams, TeamRadioParams } from "../../interfaces/openF1";
import { driverImage, numberImage, parseISOTimeFull } from "../../utils/helpers";
import { fetchSession } from "../../services/openF1Api";

const TeamRadios: React.FC<{ drivers: DriverParams[], teamRadio: TeamRadioParams[] }> = ({ drivers, teamRadio }) => {
    const [gmtOffset, setGmtOffset] = useState(null);

    useEffect(() => {
        const fetchOffset = async () => {
            const params: SessionParams = {
                session_key: teamRadio[0]?.session_key
            };
            const apiData = await fetchSession(params);
            setGmtOffset(apiData[0]?.gmt_offset);
        };

        if (teamRadio.length > 0) {
            fetchOffset();
        }
    }, [teamRadio]);

    return (
        <table className="p-0 m-3">
            {teamRadio && gmtOffset && teamRadio.map((radio: TeamRadioParams, index: number) => (
                <Radio key={index} drivers={drivers} radio={radio} gmtOffset={gmtOffset} />
            ))}
        </table>
    );
};

const Radio: React.FC<{ drivers: DriverParams[], radio: TeamRadioParams, gmtOffset: any }> = ({ drivers, radio, gmtOffset }) => {
    const driver = drivers.find(driver => driver.driver_number === radio.driver_number);

    return (
        <tr className="flex items-center h-[50px] font-extralight">
            <th className="text-[#999] text-left w-[80px] font-extralight w-1/5">{parseISOTimeFull(radio.date, gmtOffset)}</th>
            <th style={{ backgroundColor: `#${driver?.team_colour}` }} className={`flex text-left h-auto w-[100px] px-2 rounded-full bg-[#${driver?.team_colour}]`}>
                <img
                    src={driverImage(driver?.first_name, driver?.last_name)}
                    alt={`${driver?.first_name} ${driver?.last_name}`}
                    className="rounded-full w-[25px]"
                />
                <p className="font-light text-center ml-1">{driver?.name_acronym}</p>
            </th>
            <th className="items-right w-[200px]">
                <audio controls controlsList="nodownload noplaybackrate" style={{ width: '100%' }}>
                    <source src={radio.recording_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </th>
        </tr>
    )
}

/**
 *                 <img
                    src={numberImage(driver.first_name, driver.last_name)}
                    alt="Driver Number"
                    style={{height: "15px"}}
                />
 */


export default TeamRadios;
