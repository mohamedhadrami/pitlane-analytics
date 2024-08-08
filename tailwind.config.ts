// tailwind.config.js
import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  
  darkMode: "class",
  plugins: [
    require("tailwindcss-animate"),
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#E10600",
              50: "#fde7e6",
              100: "#ffc6b7",
              200: "#ffa089",
              300: "#ff795a",
              400: "#ff5637",
              500: "#ff2b10",
              600: "#fd240c",
              700: "#ef1905",
              800: "#e10700",
              900: "#c90000",
              foreground: "#FFFFFF"
            },
            secondary: {
              DEFAULT: "#f3e600"
            },
            danger: {
              DEFAULT: "#ff0505"
            },
            focus: "#00FF00",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#E10600",
              50: "#fde7e6",
              100: "#ffc6b7",
              200: "#ffa089",
              300: "#ff795a",
              400: "#ff5637",
              500: "#ff2b10",
              600: "#fd240c",
              700: "#ef1905",
              800: "#e10700",
              900: "#c90000",
              foreground: "#FFFFFF"
            },
            secondary: {
              DEFAULT: "#f3e600"
            },
            danger: {
              50: "#ffe9eb",
              100: "#ffc7cb",
              200: "#fa8f8c",
              300: "#f2615e",
              400: "#fb3333",
              500: "#ff0505",
              600: "#f1000c",
              700: "#df0007",
              800: "#d30000",
              900: "#c60000",
              DEFAULT: "#ff0505"
            },
            focus: "#00FF00",
          },
        },
      },
    }),
  ],
} satisfies Config

export default config