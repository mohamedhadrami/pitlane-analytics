// @/components/Navigation/Sidebar.tsx

"use client"

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import { NavigationItem } from "@/interfaces/custom";

interface SidebarProps {
    items: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!mounted) return null;

    const handleThemeChange = () => {
        if (theme === 'dark') setTheme('light');
        else setTheme('dark');
    };

    return (
        <div className="relative">
            <motion.div
                ref={sidebarRef}
                className={`flex flex-col p-4 gap-4 
                  fixed h-full z-30 border-r border-white
                  ${isOpen ?
                        'bg-gradient-to-r from-primary-300 to-primary-200 dark:from-primary-800 dark:to-primary-900'
                        :
                        'bg-primary-300 dark:bg-primary-800'}
                  transition-all duration-300`}
                initial={{ width: '4rem' }}
                animate={{ width: isOpen ? '16rem' : '4rem' }}
            >
                <div className={`flex ${isOpen ? 'justify-end' : 'justify-center'} items-center mb-5`}>
                    <button
                        className="text-foreground hover:text-white-800 dark:text-white-500 dark:hover:text-white-300"
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
                    </button>
                </div>

                <AnimatePresence>
                    {items.map((item: NavigationItem) => (
                        <SidebarItem key={item.key} pathname={pathname} isOpen={isOpen} item={item} />
                    ))}
                </AnimatePresence>

                <div className="flex-grow"></div>
                {/*
                        <Tooltip content='Theme' placement="right" closeDelay={0} showArrow>
                        <Button onClick={handleThemeChange} isIconOnly variant="light" aria-label="Take a photo" className="font-light text-xl flex items-center align-middle cursor-pointer">
                            <div className={`${isOpen ? '' : 'mx-auto'}`}>{theme === 'dark' ? <Sun /> : <Moon />}</div>
                        </Button>
                        </Tooltip>
                        <SidebarItem pathname={pathname} name="Releases" url="/releases" icon={<Rocket />} isOpen={isOpen} isDisabled />
                        <SidebarItem pathname={pathname} name="About" url="/about" icon={<Info />} isOpen={isOpen} isDisabled />
                        <SidebarItem pathname={pathname} name="Account" url="/account" icon={<UserRound />} isOpen={isOpen} isDisabled/>
                        <SidebarItem pathname={pathname} name="Settings" url="/settings" icon={<Settings />} isOpen={isOpen} />
                */}

            </motion.div>

            <div className="ml-16"></div>
        </div>
    );
}

export default Sidebar;
