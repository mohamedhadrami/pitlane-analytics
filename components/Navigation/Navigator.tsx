
"use client"

import { NavigationItem } from "@/interfaces/custom";
import { House, CalendarCheck, Trophy, Radio, ChartLine } from "lucide-react";
import CustomNavbar from "./CustomNavbar";
import Sidebar from "./Sidebar";

const Navigator: React.FC = () => {

  const NavigationItems: NavigationItem[] = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: <House strokeWidth={1.5}/>,
      description: "",
      isDisabled: false,
    },
    {
      key: "schedule",
      label: "Schedule",
      href: "/schedule",
      icon: <CalendarCheck strokeWidth={1.5}/>,
      description: "",
      isDisabled: false,
    },
    {
      key: "championship",
      label: "Championship",
      href: "/championship",
      icon: <Trophy strokeWidth={1.5}/>,
      description: "",
      isDisabled: false,
    },
    {
      key: "live",
      label: "Live",
      href: "/dashboard",
      icon: <Radio strokeWidth={1.5}/>,
      description: "",
      isDisabled: false,
    },
    {
      key: "telemetry",
      label: "Telemetry",
      href: "/telemetry",
      icon: <ChartLine strokeWidth={1.5}/>,
      description: "",
      isDisabled: false,
    },
    {
      key: "archive",
      label: "Archive",
      href: "/archive",
      icon: <CalendarCheck strokeWidth={1.5}/>,
      description: "",
      isDisabled: true,
    }
  ];

  return (
    <>
      <div className="sm:hidden">
        <CustomNavbar items={NavigationItems} />
      </div>
      <div className="hidden sm:block">
        <Sidebar items={NavigationItems} />
      </div>
    </>
  )
}

export default Navigator;