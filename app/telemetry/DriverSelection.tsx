"use client"

import { DriverParams } from "@/interfaces/openF1";
import { driverImage, isValidColor } from "@/utils/helpers";
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Image } from "@nextui-org/react";

interface DriverSelectionProps {
    drivers: DriverParams[],
    selectedDrivers: DriverParams[],
    toggleDriverSelect: (driver: DriverParams) => void
}

const DriverImage = styled.img<{ isSelected: boolean; borderColor: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 2px solid ${(props) => props.borderColor};
  ${(props) => props.isSelected && `background-color: ${props.borderColor};`}
  ${(props) => !props.isSelected && `filter: brightness(50%);`}
  transition: background-color ease 0.75s, filter ease 0.5s;

  &:hover {
    background-color: ${(props) => props.isSelected ? ('#000000') : (props.borderColor)};
    filter: brightness(100%);
  }
`;

const DriverSelection: React.FC<DriverSelectionProps> = ({
    drivers,
    selectedDrivers,
    toggleDriverSelect
}) => {

    useEffect(() => {
        console.log(selectedDrivers)
    }, [selectedDrivers])

    return (
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-3 px-15 pb-30">
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
                selectedDrivers &&
                selectedDrivers.includes(driver)
              }
              onClick={() => toggleDriverSelect(driver)}
            />
          );
        })}
      </div>
    );
}

export default DriverSelection;