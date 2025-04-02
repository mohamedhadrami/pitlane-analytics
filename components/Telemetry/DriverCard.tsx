"use client";

import type React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { driverImage, flagImage, isValidColor, logoImage, numberImage, teamNameConvertor } from "@/utils/helpers";
import type { OFDriver } from "@/types/openF1.types";
import { Image } from "@heroui/react";
import { fetchCountryNameByCode } from "@/services/countryApi";
import { useState, useEffect, useRef } from "react";

interface DriverCardProps {
    driver: OFDriver;
    isSelected: boolean;
    toggleSelect: (driver: OFDriver) => void;
    showSeparator: boolean;
}

const Card = styled(motion.div) <{ isselected: string; bordercolor: string }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  ${(props) =>
    props.isselected === "true" &&
    `
    background-image: linear-gradient(to bottom left, var(--tw-gradient-stops));
    --tw-gradient-from: black var(--tw-gradient-from-position);
    --tw-gradient-to: transparent var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), ${props.bordercolor}99 var(--tw-gradient-via-position), var(--tw-gradient-to);
  `}

  ${(props) =>
    props.isselected === "false" &&
    `
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
    --tw-gradient-from: black var(--tw-gradient-from-position);
    --tw-gradient-to: black var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), ${props.bordercolor}22 var(--tw-gradient-via-position), var(--tw-gradient-to);
  `}
  transition: background 0.75s ease-in, transform 0.5s ease, filter 0.5s ease;
  
  /*overflow: hidden;*/

  &:hover::before {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  &:hover {
    transform: scale(1.015);
    filter: brightness(1.05);
  }

  // Stack child content above glow
  > * {
    position: relative;
    z-index: 1;
  }
`;



const DriverImage = styled(motion.img) <{ isselected: string; bordercolor: string }>`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 2px solid ${(props) => `${props.bordercolor}99`};
    ${(props) => props.isselected === "false" && "filter: brightness(50%);"}
    ${(props) => props.isselected === "true" && "background-image: linear-gradient(to top, var(--tw-gradient-stops));"}
    ${(props) => props.isselected === "true" && "--tw-gradient-from: #fff var(--tw-gradient-from-position);"}
    ${(props) => props.isselected === "true" && "--tw-gradient-to: transparent var(--tw-gradient-to-position);"}
    ${(props) => props.isselected === "true" && `--tw-gradient-stops: var(--tw-gradient-from), ${props.bordercolor}aa var(--tw-gradient-via-position), var(--tw-gradient-to);`}
    transition: all 0.75s ease, background-color ease 1s, filter ease 0.75s;
`;

const Separator = styled(motion.div)`
    width: 100%;
    border-bottom: 1px solid #3f3f4680;
`;

const DriverCard: React.FC<DriverCardProps> = ({
    driver,
    isSelected,
    toggleSelect,
    showSeparator
}) => {

    const [hovering, setHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };
    const [showGlow, setShowGlow] = useState(false);
    const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current);
        setHovering(true);
        setShowGlow(true);
    };

    const handleMouseLeave = () => {
        setHovering(false);
        glowTimeoutRef.current = setTimeout(() => {
            setShowGlow(false);
        }, 300); // fade-out duration
    };

    const [countryName, setCountryName] = useState<string>("");
    const [teamColor, setTeamColor] = useState<string>("");
    const [numberUrl, setNumberUrl] = useState<string>("");
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [flagUrl, setFlagUrl] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (driver !== undefined) {
                const countryCode: string | undefined = driver.country_code;
                if (countryCode) {
                    const name = await fetchCountryNameByCode(countryCode);
                    setCountryName(name);
                    setFlagUrl(flagImage(name))
                }
                setTeamColor(
                    isValidColor(`#${driver.team_colour}`)
                        ? `#${driver.team_colour}`
                        : "#000000"
                );
                setNumberUrl(numberImage(driver.first_name, driver.last_name))
                const correctedTeamName = teamNameConvertor(driver.team_name)
                    ?.replace(/\s+/g, "-")
                    .toLowerCase();
                setLogoUrl(logoImage("2025", correctedTeamName))
            }
        };
        fetchData();
    });

    const borderColor = isValidColor(`#${driver.team_colour}`)
        ? `#${driver.team_colour}`
        : "#000";

    return (
        <div className="flex flex-col w-full">
            <Card
                isselected={isSelected.toString()}
                bordercolor={borderColor}
                onClick={() => toggleSelect(driver)}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <AnimatePresence>
                    {showGlow && (
                        <motion.div
                            className="pointer-events-none"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 0
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                style={{
                                    position: "absolute",
                                    width: 150,
                                    height: 150,
                                    borderRadius: "50%",
                                    background: `${borderColor}55`,
                                    filter: "blur(40px)",
                                    x: mousePos.x - 75,
                                    y: mousePos.y - 75,
                                    opacity: 0.5
                                }}
                                animate={{
                                    x: mousePos.x - 75,
                                    y: mousePos.y - 75
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 30
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <DriverImage
                    src={driver.headshot_url ?? driverImage(driver.full_name)}
                    alt={`${driver.first_name} ${driver.last_name}`}
                    bordercolor={borderColor}
                    isselected={isSelected.toString()}
                    draggable={false}
                />
                <div className="flex flex-row justify-between w-full items-center">
                    <div className="flex flex-col">
                        <p className="capitalize text-lg font-extralight">{driver.full_name.toLowerCase()}</p>
                        <p className="capitalize text-sm font-light text-default-500">{driver.team_name}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                        <Image
                            key={`${driver.driver_number}_flag`}
                            className="rounded-sm"
                            width={30}
                            src={flagUrl}
                            alt={`${driver.country_code} flag`}
                        />
                        <Image
                            key={`${driver.driver_number}_driver-number`}
                            className=""
                            width={30}
                            src={logoUrl}
                            alt="Driver Number"
                        />
                    </div>
                </div>
            </Card>

            {showSeparator && false && (
                <Separator
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                />
            )}
        </div>
    );
};

export default DriverCard;
