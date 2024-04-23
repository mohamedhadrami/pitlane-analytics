// components/Championships/DriverChampionshipCard.tsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import styles from "../../styles/championships.module.css";
import { fetchCountryNameByCode } from "../../services/countryApi";
import { DriverParams } from "../../interfaces/openF1";
import { fetchDrivers } from "../../services/openF1Api";
import { useRouter } from "next/router";
import {
  driverImage,
  flagImage,
  isValidColor,
  numberImage,
} from "../../utils/helpers";

const DriverImage = styled.img<{ borderColor: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.borderColor};
`;

const CardContainer = styled.div<{ borderColor: string }>`
  background-color: #282828;
  border-radius: 8px; /* Add border-radius for rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  padding: 20px;
  width: 300px;
  display: flex;
  justify-content: space-between;
  position: relative;
  transition: box-shadow 0.3s, border-color 0.3s;
  border: 1px solid transparent;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => props.borderColor};
  }

  &:hover ${DriverImage} {
    ${(props) => `background-color: ${props.borderColor};`}
    transition: background-color ease 1s
  }
`;

const DriverChampionshipCard: React.FC<{ driver: any }> = ({ driver }) => {
  const [driverData, setDriverData] = useState<DriverParams | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const router = useRouter();

  const handleDriverSelect = () => {
    router.push(`/driver/${driver.Driver.code}`);
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      const params: DriverParams = {
        name_acronym: driver.Driver.code,
      };
      const apiData = await fetchDrivers(params);
      setDriverData(apiData.pop());

      const name = await fetchCountryNameByCode(apiData[0]?.country_code);
      setCountryName(name);

      setTeamColor(
        isValidColor(`#${apiData.pop().team_colour}`)
          ? `#${apiData.pop().team_colour}`
          : "#FFFFFF"
      );
    };

    fetchDataFromApi();
  }, [driver]);

  return (
    <>
      <CardContainer borderColor={teamColor || "#fff"} onClick={handleDialog}>
        <div className={styles.leftSide}>
          <div className={styles.position}>{driver.position}</div>
          <p>{`${driver.Driver.givenName} ${driver.Driver.familyName}`}</p>
          <DriverImage
            src={driverImage(driver.Driver.givenName, driver.Driver.familyName)}
            alt={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
            borderColor={teamColor}
          />
        </div>
        <div className={styles.rightSide}>
          <div className={styles.point}>
            {driver.points} {driver.points === "1" ? "Point" : "Points"}
          </div>
          <p>
            <img
              src={flagImage(countryName)}
              alt={`${driver.Driver.nationality} flag`}
              className={styles.flagImage}
            />
          </p>
          <p>{driver.Constructors[0].name}</p>
          <img
            src={numberImage(driver.Driver.givenName, driver.Driver.familyName)}
            alt="Driver Number"
            className={styles.driverNumber}
          />
        </div>
      </CardContainer>
      Dialog here
    </>
  );
};

export default DriverChampionshipCard;
