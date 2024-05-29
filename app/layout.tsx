import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomNavbar from "@/components/CustomNavbar";
import { Providers } from "./providers";
import NetworkStatusClient from "@/components/NetworkStatusClient";
import { Metadata } from "next";
import { Link } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Pitlane Analytics",
    template: `%s | Pitlane Analytics`,
  },
  description: "",
  keywords: [
    "Formula 1",
    "Telemetry",
    "Racing",
    "Motorsport",
    "F1",
  ],
  authors: [
    {
      name: "mohamedhadrami",
      url: "https://www.github.com/mohamedhadrami",
    },
  ],
  creator: "mohamedhadrami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CustomNavbar />
        <Providers>
          {children}
        </Providers>
        <footer className="m-2 text-center mt-5">
          <hr />
          <p className="m-3">
            Powered by{" "}
            <Link isExternal href="https://openf1.org/">OpenF1 API</Link>{" "}
            and{" "}
            <Link isExternal href="https://ergast.com/mrd/">Ergast API</Link>
          </p>
        </footer>
        <NetworkStatusClient />
      </body>
    </html>
  );
}