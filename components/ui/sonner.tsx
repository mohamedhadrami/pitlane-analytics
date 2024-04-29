"use client"

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { BadgeCheck, Info, ShieldAlert, TriangleAlert } from "lucide-react";
import Loading from "../Loading";

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const generalClasses = "bg-gradient-to-tr p-5 gap-3 rounded-lg`";

  return (
    <Sonner
      closeButton expand pauseWhenPageIsHidden offset={16}
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast",
          description: `text-zinc-300 font-extralight`,
          title: 'text-white font-light text-base',
          actionButton: "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-900",
          cancelButton: "bg-red-500",
          success: `from-green-500 to-green-900 ${generalClasses}`,
          info: `from-zinc-800 to-[#111] ${generalClasses}`,
          loading: `from-zinc-800 to-[#111] ${generalClasses}`,
          error: `from-red-500 to-red-900 ${generalClasses}`,
          warning: `from-amber-500 to-amber-900 ${generalClasses}`,
        },
      }}
      icons={{
        success: <BadgeCheck />,
        info: <Info />,
        error: <ShieldAlert />,
        warning: <TriangleAlert />,
        loading: <Loading size={25} />
      }}
      {...props}
    />
  )
}

export { Toaster }

/*
toast:
            `group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800
            bg-gradient-to-tl from-zinc-800 to-[#111] p-5 rounded-lg`,
 */