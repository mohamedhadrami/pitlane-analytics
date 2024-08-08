
"use client"

import { Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenu, Link, NavbarMenuItem, Spacer } from "@nextui-org/react";
import { useState } from "react";
import Image from 'next/image';
import { NavigationItem } from "@/interfaces/custom";

const titleClasses = "font-light text-lg"

interface CustomNavbarProps {
  items: NavigationItem[];
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ items }) => {

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
      className="bg-[#e10600]/75 w-full border-b border-white"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand className="space-x-4">
          <Link href="/" color="foreground">
            <Image
              src="/checkered-wave-flag.png"
              style={{ width: "50px", height: "auto" }}
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
              style={{ width: "50px", height: "auto" }}
              width={50}
              height={50}
              alt="logo"
            />
          </Link>
        </NavbarBrand>
        {items.map((item: NavigationItem) => (
          <NavbarItem key={item.key} className="font-extralight">
            <Link href={item.href} color="foreground" size="lg" isDisabled={item.isDisabled}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu>
        {items.map((item: NavigationItem) => (
          <NavbarMenuItem key={item.key} className="font-extralight">
            <Link href={item.href} color="foreground" size="lg" isDisabled={item.isDisabled}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default CustomNavbar;