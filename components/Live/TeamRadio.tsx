

import type React from "react";
import { useEffect, useState } from "react";
import { driverImage, parseISOTimeFull } from "../../utils/helpers";
import { Image, ScrollShadow } from "@heroui/react";
import { useLiveSettings } from "@/context/LiveSettingsContext";
import Radio from "./Radio";
import type { LiveDriverList, LiveTeamRadio, LiveTeamRadioCapture } from "@/types/liveTiming.types";

const TeamRadios: React.FC<{ drivers: LiveDriverList, rawTeamRadio: LiveTeamRadio, path: string, gmtOffset: string }> = ({ drivers, rawTeamRadio, path, gmtOffset }) => {

    const [sortedTeamRadio, setSortedTeamRadio] = useState<LiveTeamRadioCapture[]>()

    useEffect(() => {
        if (rawTeamRadio) {
            const data = [...rawTeamRadio.Captures].sort((a, b) => Date.parse(b.Utc) - Date.parse(a.Utc));
            setSortedTeamRadio(data)
        }
    }, [rawTeamRadio])

    return (
        <div style={{ scrollbarWidth: "none" }} className="overflow-y-scroll">
                <ScrollShadow className="min-w-[300px] h-[50vh] m-1" size={50}>
                    {sortedTeamRadio && gmtOffset && sortedTeamRadio.map((radio: LiveTeamRadioCapture, index: number) => (
                        <RadioItem key={index} drivers={drivers} radio={radio} path={path} gmtOffset={gmtOffset} />
                    ))}
                </ScrollShadow>
        </div>
    );
};

const RadioItem: React.FC<{ drivers: LiveDriverList, radio: LiveTeamRadioCapture, path: string, gmtOffset: string }> = ({ drivers, radio, path, gmtOffset }) => {
    const { settings } = useLiveSettings();
    const findSetting = (name: string) => settings.find(setting => setting.name === name);
    const isShowTeamRadioTime = findSetting('Show Team Radio Time')?.value;
    
    const driver = drivers[radio.RacingNumber]

    return (
        <div className="flex items-center h-[50px] font-extralight gap-3">
            {isShowTeamRadioTime && (<div className="text-[#999] text-left font-extralight w-[12%]">
                {parseISOTimeFull(radio.Utc, gmtOffset)}
            </div>)}
            <div style={{ backgroundColor: `#${driver?.TeamColour}` }} className={"flex text-left h-auto w-[75px] rounded-full"}>
                <Image
                    src={driverImage(driver?.FirstName, driver?.LastName)}
                    alt={`${driver?.FirstName} ${driver?.LastName}`}
                    className="rounded-full w-[25px]"
                />
                <p className="font-light text-center ml-1">{driver?.Tla}</p>
            </div>
            <Radio key={radio.Utc} url={`https://livetiming.formula1.com/static/${path}${radio.Path}`} teamColor={`#${driver?.TeamColour}`} />
        </div>
    );
}

export default TeamRadios;
