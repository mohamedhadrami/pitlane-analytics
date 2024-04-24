// components/ConstructorChampionshipCard.tsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DriverParams } from "../../interfaces/openF1";
import { useRouter } from "next/navigation";
import { carImage, isValidColor, logoImage, teamNameConvertor } from "../../utils/helpers";
import { Divider, Image, Spacer } from "@nextui-org/react";

const CardContainer = styled.div<{ borderColor: string }>`
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => props.borderColor};
  }
`;

const ConstructorChampionshipCard: React.FC<{
  constructor: any;
  year: string;
  drivers: DriverParams[];
}> = ({ constructor, year, drivers }) => {
  const [teamName, setTeamName] = useState<string>("");
  const [teamColor, setTeamColor] = useState<string>("");
  const [carImageUrl, setCarImageUrl] = useState<string>("");
  const [logoImageUrl, setLogoImageUrl] = useState<string>("");

  const router = useRouter();

  const handleConstructorSelect = () => {
    router.push(`/constructor/${constructor.Constructor.constructorId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (drivers) {
        const apiDriverData: DriverParams | undefined = drivers.find(v => v.team_name === teamNameConvertor(constructor.Constructor.name));
        setTeamColor(
          isValidColor(`#${apiDriverData?.team_colour}`)
            ? `#${apiDriverData?.team_colour}`
            : "#FFFFFF"
        );
        setTeamName(constructor.Constructor.name);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const correctedTeamName = teamNameConvertor(teamName)
      ?.replace(/\s+/g, "-")
      .toLowerCase();
    const carUrl = carImage(year, correctedTeamName);
    const logoUrl = logoImage(year, correctedTeamName);
    setCarImageUrl(carUrl);
    setLogoImageUrl(logoUrl);
  }, [teamName, year]);

  return (
    <CardContainer 
      className="bg-zinc-800 rounded-lg p-3 min-w-80 shadow-md transition duration-300 border border-transparent"
      borderColor={teamColor} 
      onClick={handleConstructorSelect}
    >
      <div className="flex p-2">
        <span className="text-3xl font-bold">{constructor.position}</span>
        <span className="flex items-center text-lg ml-auto">
          <span className="font-medium">{constructor.points}</span>
          <Spacer x={1} />
          <span className="font-thin">{constructor.points === "1" ? "Point" : "Points"}</span>
        </span>
      </div>
      <Divider className="" />
      <div className="flex flex-col p-2">
        <div className="flex flex-row items-center justify-between">
          <p>{constructor.Constructor.name}</p>
          <Image
            src={logoImageUrl}
            alt={`${constructor.Constructor.name} logo`}
            width={75}
          />
        </div>
      </div>
      <div>
        <Image
          src={carImageUrl}
          alt={`${constructor.Constructor.name} car`}
          height={300}
        />
      </div>
    </CardContainer>
  );
};

export default ConstructorChampionshipCard;
