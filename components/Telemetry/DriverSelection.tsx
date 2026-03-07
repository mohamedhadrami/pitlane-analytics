// @/components/Telemetry/DriverSelection.tsx

"use client"

import { DriverParams } from "@/interfaces/openF1";
import { driverImage, isValidColor } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTelemetry } from "@/context/Telemetry/TelemetryContext";
import { useToggleDriverSelect } from "@/hooks/Telemetry/useTelemetryData";
import { useTelemetryUI } from "@/context/Telemetry/TelemetryUIContext";
import { Tooltip } from "@nextui-org/react";

const DriverSelection: React.FC = () => {

  const {
    drivers,
    selectedDrivers,
  } = useTelemetry();

  const toggleDriverSelect = useToggleDriverSelect();

  const handleDriverSelection = (driver: DriverParams) => {
    toggleDriverSelect(driver);
    if (selectedDrivers.has(driver.driver_number?.toString()!)) {
      //toast.info(`Unselected ${driver.first_name} ${driver.last_name}`)
    } else {
      //toast.info(`Selected ${driver.first_name} ${driver.last_name}`)
    }
  }

  const { direction } = useTelemetryUI();

  const commonTransition = { duration: 0.5, ease: "easeInOut" };

  const [initialX, setInitialX] = useState<number>();
  const [exitX, setExitX] = useState<number>();

  useEffect(() => {
    const getAnimationValues = () => {
      if (direction === 'next') {
        setInitialX(300)
        setExitX(-300)
      } else {
        setInitialX(-300)
        setExitX(300)
      }
    };

    getAnimationValues();
  }, [direction])

  return (
    <motion.div
      key="driver-selection"
      initial={{ opacity: 0, y: exitX }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: initialX }}
      transition={commonTransition}
      className="max-w-lg py-20 h-full flex flex-wrap justify-center gap-3"
    >
      {drivers.map((driver: DriverParams) => {
        const borderColor = isValidColor(`#${driver.team_colour}`)
          ? `#${driver.team_colour}`
          : "#fff";
        const isSelected = selectedDrivers?.has(driver.driver_number?.toString()!) ?? false;

        return (
          <Tooltip
            classNames={{
              content: [
                "py-2 px-4 shadow-xl",
                "text-foreground bg-gradient-to-t from-zinc-800",
              ],
            }}
            content={driver.full_name}
            key={driver.driver_number}
          >
            <motion.div
              className="relative w-[100px] h-[100px] rounded-full cursor-pointer overflow-hidden"
              style={{
                border: `1px solid ${borderColor}`,
                filter: isSelected ? "brightness(100%)" : "brightness(50%)",
                backgroundImage: isSelected
                  ? `linear-gradient(to top, ${borderColor}, #000000)`
                  : "none",
              }}
              onClick={() => handleDriverSelection(driver)}
              whileHover={{
                filter: "brightness(100%)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={driverImage(driver.full_name!)}
                alt={`${driver.first_name} ${driver.last_name}`}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3 },
                }}
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>
          </Tooltip>
        );
      })}
    </motion.div>
  );
};

export default DriverSelection;