// @/components/Driver/DriverPageClient.tsx

"use client"

import type { OFDriver } from "@/types/openF1.types";
import { fetchDrivers } from "@/services/openF1Api";
import { driverImage } from "@/utils/helpers";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

type Props = {
  slug: string;
};

const DriverPageClient: React.FC<Props> = ({ slug }) => {
  const [driver, setDriver] = useState<OFDriver>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchDrivers({ name_acronym: slug });
      const driverData = res.pop();
      setDriver(driverData);
    };
    fetchData();
  }, [slug]);

  return (
    <>
      {driver?.first_name && (
        <div>
          <p>{driver.full_name}</p>
          <Image
            src={driverImage(driver.first_name, driver.last_name)}
            alt={`${driver.first_name} ${driver.last_name}`}
            className="rounded-full"
          />
        </div>
      )}
    </>
  );
};

export default DriverPageClient;
