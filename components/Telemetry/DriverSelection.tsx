// @/components/Telemetry/DriverSelection.tsx

"use client";

import type React from "react";
import DriverCard from "@/components/Telemetry/DriverCard";
import { useTelemetry } from "@/context/TelemetryContext";
import { useToggleDriverSelect } from "@/hooks/Telemetry/useToggleDriverSelect";

const DriverSelection: React.FC = () => {
  const {
    drivers,
    selectedDrivers
  } = useTelemetry()

  const toggleDriverSelect = useToggleDriverSelect()

  return (
    <div className="w-full flex flex-col">
      {drivers.map((driver, index) => (
        <DriverCard
          key={driver.driver_number}
          driver={driver}
          isSelected={selectedDrivers.has(driver.driver_number.toString())}
          toggleSelect={toggleDriverSelect}
          showSeparator={index !== drivers.length - 1}
        />
      ))}
    </div>
  );
};

export default DriverSelection;