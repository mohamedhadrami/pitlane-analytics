// @/app/driver/[slug]/page.tsx

"use client"

import { DriverParams } from "@/interfaces/openF1";
import { fetchDrivers } from "@/services/openF1Api";
import { driverImage } from "@/utils/helpers";
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

const Page: React.FC<{ params: { slug: string } }> = ({ params }) => {
    const [driver, setDriver] = useState<DriverParams>({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchDrivers({ name_acronym: params.slug });
            const driverData = res.pop();
            setDriver(driverData);
        }
        fetchData();
    }, [params])

    return (
        <>
            {driver && driver.first_name && (
                <div>
                    <p>{driver.full_name}</p>
                    <Image
                        src={driverImage(driver?.first_name!, driver?.last_name!)}
                        alt={`${driver?.first_name} ${driver?.last_name}`}
                        className="rounded-full"
                    />
                </div>
            )}
        </>
    )
}

export default Page;