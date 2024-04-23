// components/ConstructorChampionshipCard.tsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import styles from "../../styles/championships.module.css";
import {
  fetchCountryFlagByCode,
  fetchCountryNameByCode,
} from "../../services/countryApi";
import { DriverParams } from "../../interfaces/openF1";
import { fetchDrivers } from "../../services/openF1Api";
import { useRouter } from "next/router";
import { carImage, isValidColor, logoImage } from "../../utils/helpers";

function teamNameConvertor(name: string) {
  switch (name) {
    case "Red Bull":
      return "Red Bull Racing";
    case "Sauber":
      return "Kick Sauber";
    case "RB F1 Team":
      return "RB";
    case "Alpine F1 Team":
      return "Alpine";
    default:
      return name;
  }
}

const CardContainer = styled.div<{ borderColor: string }>`
  background-color: #191919;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: box-shadow 0.3s, border-color 0.3s;
  border: 1px solid transparent;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => props.borderColor};
  }
`;

const ConstructorChampionshipCard: React.FC<{
  constructor: any;
  year: string;
}> = ({ constructor, year }) => {
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [carImageUrl, setCarImageUrl] = useState<string | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);

  const router = useRouter();
  const handleConstructorSelect = () => {
    router.push(`/constructor/${constructor.Constructor.constructorId}`);
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      const params: DriverParams = {
        team_name: teamNameConvertor(constructor.Constructor.name),
      };
      const apiData = await fetchDrivers(params);

      setTeamColor(
        isValidColor(`#${apiData.pop().team_colour}`)
          ? `#${apiData.pop().team_colour}`
          : "#FFFFFF"
      );
      setTeamName(constructor.Constructor.name);
    };

    fetchDataFromApi();
  }, [constructor]);

  useEffect(() => {
    const correctedTeamName = teamNameConvertor(teamName)
      ?.replace(/\s+/g, "-")
      .toLowerCase();
    const carUrl = carImage(year, correctedTeamName);
    const logoUrl = logoImage(year, correctedTeamName);
    setCarImageUrl(carUrl);
    setLogoImageUrl(logoUrl);
  }, [teamName]);

  return (
    <CardContainer borderColor={teamColor} onClick={handleConstructorSelect}>
      <div className={styles.topRow}>
        <div className={styles.leftSide}>
          <div className={styles.position}>{constructor.position}</div>
          <p>{constructor.Constructor.name}</p>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.point}>
            {constructor.points}{" "}
            {constructor.points === "1" ? "Point" : "Points"}
          </div>
          <img
            src={logoImageUrl}
            alt={`${constructor.Constructor.name} logo`}
            className={styles.logoImage}
          />
        </div>
      </div>
      <div className={styles.bottomRow}>
        <img
          src={carImageUrl}
          alt={`${constructor.Constructor.name} car`}
          className={styles.carImage}
        />
      </div>
    </CardContainer>
  );
};

export default ConstructorChampionshipCard;
