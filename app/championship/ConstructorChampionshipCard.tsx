// @/components/ConstructorChampionshipCard.tsx

import type React from "react";
import { useState, useEffect } from "react";
import { styled } from "styled-components";
import type { OFDriver } from "@/types/openF1.types";
import { carImage, isValidColor, logoImage, teamNameConvertor } from "@/utils/helpers";
import { Divider, Image, Spacer } from "@heroui/react";
import ConstructorDrawer from "@/components/drawers/ConstructorDrawer";
import type { JLPConstructorStandingItem } from "@/types/jolpica.types";

const CardContainer = styled.div<{ bordercolor: string }>`
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid ${(props) => props.bordercolor};
  }
`;

const ConstructorChampionshipCard: React.FC<{
  constructorTeam: JLPConstructorStandingItem;
  year: string;
  drivers: OFDriver[];
}> = ({ constructorTeam, year, drivers }) => {
  const [teamName, setTeamName] = useState<string>("");
  const [teamColor, setTeamColor] = useState<string>("");
  const [carImageUrl, setCarImageUrl] = useState<string>("");
  const [logoImageUrl, setLogoImageUrl] = useState<string>("");
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleConstructorSelect = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (drivers) {
        const apiDriverData: OFDriver | undefined = drivers.find(v => v.team_name === teamNameConvertor(constructorTeam.Constructor.name));
        setTeamColor(
          isValidColor(`#${apiDriverData?.team_colour}`)
            ? `#${apiDriverData?.team_colour}`
            : "#FFFFFF"
        );
        setTeamName(constructorTeam.Constructor.name);
      }
    };
    fetchData();
  }, [constructorTeam.Constructor.name, drivers]);

  useEffect(() => {
    const correctedTeamName = teamNameConvertor(teamName)
      ?.replace(/\s+/g, "-")
      .toLowerCase();
    const carUrl = carImage(year, correctedTeamName);
    const logoUrl = logoImage(year, correctedTeamName);
    setCarImageUrl(carUrl);
    setLogoImageUrl(logoUrl);
  }, [teamName, year]);

  const positionColor = (position: string) => {
    switch (position) {
      case "1":
        return "from-yellow-300";
      case "2":
        return "from-slate-800";
      case "3":
        return "from-orange-900"
      default:
        return "from-zinc-800";
    }
  }

  return (
    <>
      <CardContainer
        className={`bg-gradient-to-br ${positionColor(constructorTeam.position)} to-zinc-500 
                    rounded-lg p-3 min-w-80 shadow-md 
                    transition duration-300 border border-transparent`}
        bordercolor={teamColor}
        onClick={handleConstructorSelect}
      >
        <div className="flex p-2">
          <span className="text-3xl font-bold">{constructorTeam.position}</span>
          <span className="flex items-center text-lg ml-auto">
            <span className="font-medium">{constructorTeam.points}</span>
            <Spacer x={1} />
            <span className="font-thin">{constructorTeam.points === "1" ? "Point" : "Points"}</span>
          </span>
        </div>
        <Divider className="" />
        <div className="flex flex-col p-2">
          <div className="flex flex-row items-center justify-between">
            <p>{constructorTeam.Constructor.name}</p>
            <Image
              src={logoImageUrl}
              alt={`${constructorTeam.Constructor.name} logo`}
              width={75}
            />
          </div>
        </div>
        <div>
          <Image
            src={carImageUrl}
            alt={`${constructorTeam.Constructor.name} car`}
            height={300}
          />
        </div>
      </CardContainer>
      {constructorTeam && teamName && (
        <ConstructorDrawer isOpen={openDrawer} setIsOpen={setOpenDrawer} constructor={constructorTeam} teamName={teamName} />
      )}
    </>
  );
};

export default ConstructorChampionshipCard;
