
"use client"

import { Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem, Button, NavbarMenu, Link, NavbarMenuItem } from "@nextui-org/react";
import { Menu } from "lucide-react";
import { useState } from "react";


const CustomNavbar: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuItems = {
    "Schedule": "/schedule",
    "Championship": "/championship",
    "Live": "/dashboard",
    "Telemetry": "/telemetry",
    "Archive": "/archive",
    "Log Out": "/",
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={true}
      className="bg-[#e10600]/75"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">Pitlane Analytics</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarBrand>
          <p className="font-bold text-inherit">Pitlane Analytics</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/schedule">Schedule</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/championship">Championship</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/dashboard">Live</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/telemetry">Telemetry</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/archive">Archive</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {Object.entries(menuItems).map(([label, href], index) => (
          <NavbarMenuItem key={`${label}-${index}`}>
            <Link href={href} color={index === 2 ? "warning" : index === Object.keys(menuItems).length - 1 ? "danger" : "foreground"} size="lg">
                {label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default CustomNavbar;