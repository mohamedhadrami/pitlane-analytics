import React, { useEffect, useState } from "react";
import { DriverParams, SessionParams, TeamRadioParams } from "../../interfaces/openF1";
import { driverImage, numberImage, parseISOTimeFull } from "../../utils/helpers";
import { fetchSession } from "../../services/openF1Api";
import { Image, ScrollShadow } from "@nextui-org/react";
import { useLiveSettings } from "../../context/LiveSettingsContext";
import Radio from "./Radio";

const TeamRadios: React.FC<{ drivers: DriverParams[], teamRadio: TeamRadioParams[] }> = ({ drivers, teamRadio }) => {
    const [gmtOffset, setGmtOffset] = useState<string | null>(null);

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

    // Sort the teamRadio array by date in descending order
    const sortedTeamRadio = [...teamRadio].sort((a, b) => Date.parse(b.date!) - Date.parse(a.date!));

    return (
        <div style={{ scrollbarWidth: "none" }} className="overflow-y-scroll">
                <ScrollShadow className="min-w-[300px] h-[50vh] m-1" size={50}>
                    {sortedTeamRadio && gmtOffset && sortedTeamRadio.map((radio: TeamRadioParams, index: number) => (
                        <RadioItem key={index} drivers={drivers} radio={radio} gmtOffset={gmtOffset} />
                    ))}
                </ScrollShadow>
        </div>
    );
};

const RadioItem: React.FC<{ drivers: DriverParams[], radio: TeamRadioParams, gmtOffset: string }> = ({ drivers, radio, gmtOffset }) => {
    const { settings } = useLiveSettings();
    const findSetting = (name: string) => settings.find(setting => setting.name === name);
    const isShowTeamRadioTime = findSetting('Show Team Radio Time')?.value;
    
    const driver = drivers.find(driver => driver.driver_number === radio.driver_number);

    return (
        <div className="flex items-center h-[50px] font-extralight gap-3">
            {isShowTeamRadioTime && (<div className="text-[#999] text-left font-extralight w-[12%]">
                {parseISOTimeFull(radio.date, gmtOffset)}
            </div>)}
            <div style={{ backgroundColor: `#${driver?.team_colour}` }} className={`flex text-left h-auto w-[75px] rounded-full`}>
                <Image
                    src={driverImage(driver?.first_name!, driver?.last_name!)}
                    alt={`${driver?.first_name} ${driver?.last_name}`}
                    className="rounded-full w-[25px]"
                />
                <p className="font-light text-center ml-1">{driver?.name_acronym}</p>
            </div>
            <Radio key={radio.date} radio={radio} teamColor={`#${driver?.team_colour}`} />
        </div>
    );
}

export default TeamRadios;
