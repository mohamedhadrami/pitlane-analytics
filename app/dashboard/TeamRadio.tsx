
import React, { useEffect, useRef, useState } from "react";
import { DriverParams, SessionParams, TeamRadioParams } from "../../interfaces/openF1";
import { driverImage, numberImage, parseISOTimeFull } from "../../utils/helpers";
import { fetchSession } from "../../services/openF1Api";
import { Image } from "@nextui-org/react";

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
        <div style={{ scrollbarWidth: "none" }}
            className="overflow-y-scroll h-[50vh]">
            <div className="p-0 m-3">
                {teamRadio && gmtOffset && teamRadio.map((radio: TeamRadioParams, index: number) => (
                    <Radio key={index} drivers={drivers} radio={radio} gmtOffset={gmtOffset} />
                ))}
            </div>
        </div>
    );
};

const Radio: React.FC<{ drivers: DriverParams[], radio: TeamRadioParams, gmtOffset: any }> = ({ drivers, radio, gmtOffset }) => {
    const driver = drivers.find(driver => driver.driver_number === radio.driver_number);

    return (
        <div className="flex items-center h-[50px] font-extralight gap-3">
            <div className="text-[#999] text-left font-extralight w-1/6">
                {parseISOTimeFull(radio.date, gmtOffset)}
            </div>
            <div style={{ backgroundColor: `#${driver?.team_colour}` }} className={`flex text-left h-auto w-[75px] rounded-full bg-[#${driver?.team_colour}]`}>
                <Image
                    src={driverImage(driver?.first_name!, driver?.last_name!)}
                    alt={`${driver?.first_name} ${driver?.last_name}`}
                    className="rounded-full w-[25px]"
                />
                <p className="font-light text-center ml-1">{driver?.name_acronym}</p>
            </div>
            <div className="items-right w-[200px]">
                <audio controls controlsList="nodownload noplaybackrate" className="w-ful">
                    <source src={radio.recording_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    )
}

/**
<tr className="flex items-center h-[50px] font-extralight">
            <th className="text-[#999] text-left font-extralight w-1/5">{parseISOTimeFull(radio.date, gmtOffset)}</th>
            <th className="flex text-left h-auto w-[100px]">
                <Chip
                    variant="light"
                    style={{ backgroundColor: `#${driver?.team_colour}` }} 
                    avatar={
                        <Avatar
                            name={driver?.name_acronym}
                            className="rounded-full bg-transparent"
                            src={driverImage(driver?.first_name!, driver?.last_name!)}
                        />
                    }
                >{driver?.name_acronym}</Chip>
            </th>
            <th className="items-right w-[200px]">
                <audio controls controlsList="nodownload noplaybackrate" style={{ width: '100%' }}>
                    <source src={radio.recording_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </th>
        </tr>
 */


export default TeamRadios;
