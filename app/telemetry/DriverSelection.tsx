"use client"

import { DriverChartData } from "@/interfaces/custom";
import { DriverParams } from "@/interfaces/openF1";
import { driverImage, isValidColor } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface DriverSelectionProps {
  drivers: DriverParams[],
  selectedDrivers: Map<string, DriverChartData>
  toggleDriverSelect: (driver: DriverParams) => void
}

const DriverImage = styled.img<{ isselected: boolean; bordercolor: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 2px solid ${(props) => props.bordercolor};
  ${(props) => props.isselected && `background-color: ${props.bordercolor};`}
  ${(props) => !props.isselected && `filter: brightness(50%);`}
  transition: background-color ease 0.75s, filter ease 0.5s;

  &:hover {
    background-color: ${(props) => props.isselected ? ('#000000') : (props.bordercolor)};
    filter: brightness(100%);
  }
`;

const DriverSelection: React.FC<DriverSelectionProps> = ({
  drivers,
  selectedDrivers,
  toggleDriverSelect
}) => {

  const handleDriverSelection = (driver: DriverParams) => {
    toggleDriverSelect(driver);
  }

  return (
    <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-3 px-15 pb-30">
      {drivers.map((driver: DriverParams) => {
        const borderColor = isValidColor(`#${driver.team_colour}`)
          ? `#${driver.team_colour}`
          : "#fff";
        return (
          <DriverImage
            key={driver.driver_number}
            src={driverImage(driver.full_name!)}
            alt={`${driver.first_name} ${driver.last_name}`}
            bordercolor={borderColor}
            isselected={
              selectedDrivers &&
              selectedDrivers.has(driver.driver_number?.toString()!)
            }
            onClick={() => {
              handleDriverSelection(driver);
            }}
          />
        );
      })}
    </div>
  );
}

export default DriverSelection;