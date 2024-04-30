
"use client"

import { Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenu, Link, NavbarMenuItem, Spacer } from "@nextui-org/react";
import { useState } from "react";
import Image from 'next/image';

const titleClasses = "font-light text-lg"

const CustomNavbar: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuItems = {
    "Schedule": "/schedule",
    "Championship": "/championship",
    "Live": "/dashboard",
    "Telemetry": "/telemetry",
    "Archive": "/archive"
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={true}
      className="bg-[#e10600]/75 w-full"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand className="space-x-4">
        <Link href="/" color="foreground">
            <Image
              src="/checkered-wave-flag.png"
              style={{width: "50px", height: "auto"}}
              width={50}
              height={50}
              alt="logo"
            />
            <Spacer x={4} />
            <p className={titleClasses}>Pitlane Analytics</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarBrand className="space-x-4">
          <Link href="/" color="foreground">
            <p className={titleClasses}>Pitlane Analytics</p>
            <Spacer x={4} />
            <Image
              src="/checkered-wave-flag.png"
              style={{width: "50px", height: "auto"}}
              width={50}
              height={50}
              alt="logo"
            />
          </Link>
        </NavbarBrand>
        {Object.entries(menuItems).map(([label, href], index) => (
          <NavbarItem key={`${label}-${index}`} className="font-extralight">
            <Link href={href} color="foreground">
              {label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu>
        {Object.entries(menuItems).map(([label, href], index) => (
          <NavbarMenuItem key={`${label}-${index}`} className="font-extralight">
            <Link href={href} color="foreground" size="lg">
              {label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default CustomNavbar;