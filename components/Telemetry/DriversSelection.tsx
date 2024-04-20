// components/DriverSelection.tsx

import React from "react";
import styled from "styled-components";
import { DriverParams } from "../../interfaces/openF1";
import styles from "../../styles/telemetry.module.css";
import { driverImage, isValidColor } from "../../utils/helpers";


interface DriverSelectionProps {
  drivers: DriverParams[];
  selectedDriversData: Map<string, any>;
  toggleDriverSelect: (driver: DriverParams) => void;
}

const DriverImage = styled.img<{ isSelected: boolean; borderColor: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.borderColor};
  ${(props) => props.isSelected && `background-color: ${props.borderColor};`}
  ${(props) => !props.isSelected && `filter: brightness(50%);`}
  transition: background-color ease 1s, filter ease 0.5s;

  &:hover {
    background-color: ${(props) => props.isSelected ? ('#000000') : (props.borderColor)};
    filter: brightness(100%);
  }
`;

const DriverSelection: React.FC<DriverSelectionProps> = ({
  drivers,
  selectedDriversData,
  toggleDriverSelect,
}) => {

  return (
    <>
      <h3>Selected Drivers</h3>
      <div className={styles.driverContainer}>
        {drivers.map((driver: DriverParams) => {
          const borderColor = isValidColor(`#${driver.team_colour}`)
            ? `#${driver.team_colour}`
            : "#fff";
          return (
            <DriverImage
              key={driver.driver_number}
              src={driverImage(driver.full_name)}
              alt={`${driver.first_name} ${driver.last_name}`}
              borderColor={borderColor}
              isSelected={
                selectedDriversData &&
                selectedDriversData.has(driver.driver_number.toString())
              }
              onClick={() => toggleDriverSelect(driver)}
            />
          );
        })}
      </div>
    </>
  );
};

export default DriverSelection;
