// @/components/Navigation/SidebarItem.tsx

import { NavigationItem } from "@/interfaces/custom";
import { Chip, Link, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { cloneElement } from "react";

interface SidebarItemProps {
    pathname: string;
    isOpen: boolean;
    item: NavigationItem;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ pathname, isOpen, item }) => {
    const itemVariants = {
        open: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        closed: { opacity: 0, x: -20, transition: { duration: 0.5 } },
    };

    const textTransition = { delay: 0.5, duration: 0.5 };

    const textVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <>
            {isOpen ? (
                <AnimatePresence>
                    <motion.div
                        key={item.key}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={itemVariants}
                        transition={{ duration: 1.5 }}
                        className="relative w-full flex flex-row items-center"
                    >
                        <Link
                            href={item.href}
                            isDisabled={item.isDisabled}
                            color="foreground"
                            className="relative font-light text-xl flex items-center align-middle cursor-pointer text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-300 group"
                        >
                            <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-[2px] transition-all duration-300 ease-out group-hover:h-full group-focus:h-full h-0 ${pathname === item.href ? 'bg-secondary' : 'bg-foreground'}`}></div>
                            <div className="ml-3">
                                {cloneElement(item.icon, { className: pathname === item.href ? 'text-secondary' : 'text-foreground' })}
                            </div>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={textVariants}
                                transition={textTransition}
                                className={`ml-2 flex flex-row items-baseline gap-2 ${pathname === item.href ? 'text-secondary' : 'text-foreground'}`}
                            >
                                {item.label}
                            </motion.div>
                        </Link>
                        {item.isDisabled && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={textVariants}
                                transition={textTransition}
                                className={`ml-2 flex flex-row items-baseline gap-2 ${pathname === item.href ? 'text-secondary' : 'text-foreground'}`}
                            >
                                <Chip
                                    variant="shadow"
                                    size="sm"
                                    className="text-xs ml-auto"
                                    classNames={{
                                        base: "bg-gradient-to-br from-primary-500 to-secondary border-small border-white/50 shadow-white/30",
                                        content: "drop-shadow shadow-black text-white",
                                    }}
                                >
                                    Coming Soon
                                </Chip>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            ) : (
                <Tooltip content={item.label} placement="right" closeDelay={0} showArrow>
                    <motion.div
                        key={item.key}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={itemVariants}
                        transition={{ duration: 0.2 }}
                        className="relative w-full"
                    >
                        <Link
                            href={item.href}
                            isDisabled={item.isDisabled}
                            color="foreground"
                            className="font-light text-xl flex items-center align-middle cursor-pointer text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-300 group"
                        >
                            <div className="mx-auto">
                                {cloneElement(item.icon, { className: pathname === item.href ? 'text-secondary' : 'text-foreground' })}
                            </div>
                        </Link>
                    </motion.div>
                </Tooltip>
            )}
        </>
    );
}

export default SidebarItem;
