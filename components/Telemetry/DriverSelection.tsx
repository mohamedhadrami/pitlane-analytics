// @/components/Telemetry/DriverSelection.tsx

"use client"

import { DriverChartData } from "@/interfaces/custom";
import { DriverParams } from "@/interfaces/openF1";
import { driverImage, isValidColor } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface DriverSelectionProps {
  drivers: DriverParams[],
  selectedDrivers: Map<string, DriverChartData>
  toggleDriverSelect: (driver: DriverParams) => void
}

const DriverImage = styled(motion.img) <{ isselected: string; bordercolor: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 2px solid ${(props) => props.bordercolor};
  ${(props) => props.isselected == "false" && `filter: brightness(50%);`}
  ${(props) => props.isselected == "true" && `background-image: linear-gradient(to top, var(--tw-gradient-stops));`}
  ${(props) => props.isselected == "true" && `--tw-gradient-from: #fff var(--tw-gradient-from-position);`}
  ${(props) => props.isselected == "true" && `--tw-gradient-to: transparent var(--tw-gradient-to-position);`}
  ${(props) => props.isselected == "true" && `--tw-gradient-stops: var(--tw-gradient-from), ${props.bordercolor} var(--tw-gradient-via-position), var(--tw-gradient-to);`}
  transition: background-color ease 0.75s, filter ease 0.5s;

  &:hover {
    background-color: ${(props) => props.isselected == "true" ? ('#000000') : (props.bordercolor)};
    filter: brightness(100%);
  }
`;

const DriverSelection: React.FC<DriverSelectionProps> = ({
  drivers,
  selectedDrivers,
  toggleDriverSelect
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDriverSelection = (driver: DriverParams) => {
    toggleDriverSelect(driver);
    if (selectedDrivers.has(driver.driver_number?.toString()!)) {
      //toast.info(`Unselected ${driver.first_name} ${driver.last_name}`)
    } else {
      //toast.info(`Selected ${driver.first_name} ${driver.last_name}`)
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto flex flex-wrap justify-center gap-3 px-15 pb-30">
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
                (selectedDrivers &&
                  selectedDrivers.has(driver.driver_number?.toString()!)).toString()
              }
              onClick={() => {
                handleDriverSelection(driver);
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1}}
            />
          );
        })
      }
    </div>
  );
}

export default DriverSelection;