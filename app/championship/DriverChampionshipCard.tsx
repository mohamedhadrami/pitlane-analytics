// components/Championships/DriverChampionshipCard.tsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchCountryNameByCode } from "../../services/countryApi";
import { DriverParams } from "../../interfaces/openF1";
import { Image, Divider, Spacer } from "@nextui-org/react";
import {
  driverImage,
  flagImage,
  isValidColor,
  logoImage,
  numberImage,
  teamNameConvertor,
} from "../../utils/helpers";
import DriverDrawer from "@/components/drawers/DriverDrawer";

const DriverChampionshipCard: React.FC<{
  driver: any;
  drivers: DriverParams[];
  year: string;
}> = ({ driver, drivers, year }) => {
  const [driverData, setDriverData] = useState<DriverParams>();
  const [countryName, setCountryName] = useState<string>("");
  const [teamColor, setTeamColor] = useState<string>("");
  const [numberUrl, setNumberUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [flagUrl, setFlagUrl] = useState<string>("");
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleDriverSelect = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (drivers) {
        const apiDriverData: DriverParams | undefined = drivers.find(v => v.name_acronym === driver.Driver.code);
        setDriverData(apiDriverData);
        if (apiDriverData != undefined) {
          const countryCode: string = apiDriverData.country_code!;
          const name = await fetchCountryNameByCode(countryCode);
          setCountryName(name);
          setTeamColor(
            isValidColor(`#${apiDriverData?.team_colour}`)
              ? `#${apiDriverData?.team_colour}`
              : "#FFFFFF"
          );
        }
        setNumberUrl(numberImage(driver.Driver.givenName, driver.Driver.familyName))
        const correctedTeamName = teamNameConvertor(driver.Constructors[0].name)
          ?.replace(/\s+/g, "-")
          .toLowerCase();
        setLogoUrl(logoImage(year, correctedTeamName))
      }
    };
    fetchData();
  });

  useEffect(() => {
    setFlagUrl(flagImage(countryName))
  }, [countryName])

  return (
    <>
      {driver && flagUrl && (
        <CardContainer
          key={`${driver.Driver.code}_card`}
          className="bg-gradient-to-br from-zinc-800 to-zinc-800 border-[#111] rounded-lg p-3 min-w-80 shadow-md transition duration-300 border border-transparent"
          bordercolor={teamColor || "#fff"}
          onClick={handleDriverSelect}
        >
          <div className="flex p-2">
            <span className="text-3xl font-bold">{driver.position}</span>
            <span className="flex items-center text-lg ml-auto">
              <span className="font-medium">{driver.points}</span>
              <Spacer x={1} />
              <span className="font-thin">{driver.points === "1" ? "Point" : "Points"}</span>
            </span>
          </div>
          <Divider className="" />
          <div className="flex flex-col p-2">
            <div className="flex flex-row items-center justify-between">
              <span>{`${driver.Driver.givenName} ${driver.Driver.familyName}`}</span>
              <Image
                key={`${driver.Driver.code}_flag`}
                className="rounded-md mt-2"
                width={40}
                src={flagUrl}
                alt={`${driver.Driver.nationality} flag`}
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <span>{driver.Constructors[0].name}</span>
              <Image
                key={`${driver.Driver.code}_team-logo`}
                className="mt-2"
                width={40}
                src={logoUrl}
                alt={`${driver.Constructors[0].name} logo`}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between p-2">
            <DriverImage
              key={`${driver.Driver.code}_driver-image`}
              className="w-24 h-24 rounded-full bg-gradient-to-t from-transparent to-transparent"
              src={driverImage(driver.Driver.givenName, driver.Driver.familyName)}
              alt={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
              bordercolor={teamColor}
            />
            <div className="flex items-center">
              <Image
                key={`${driver.Driver.code}_driver-number`}
                className="inline-block align-middle"
                src={numberUrl}
                alt="Driver Number"
              />
            </div>
          </div>
        </CardContainer>
      )}
      {driverData && (
        <DriverDrawer
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          driver={driver}
          driverData={driverData}
        />
      )}
    </>
  );
};

export default DriverChampionshipCard;

const DriverImage = styled.img<{ bordercolor: string }>`
  border: 1px solid ${(props) => props.bordercolor};
`;

const CardContainer = styled.div<{ bordercolor: string }>`
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => props.bordercolor};
  }
  border-color: #111;
  ${(props) => `--tw-gradient-from: ${props.bordercolor} var(--tw-gradient-from-position);`}
  
  &:hover ${DriverImage} {
    ${(props) => `--tw-gradient-from: ${props.bordercolor} var(--tw-gradient-from-position);`}
    ${(props) => `--tw-gradient-to: #111 var(--tw-gradient-to-position);`}
  }
`;
