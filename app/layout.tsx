import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomNavbar from "@/components/Navigation/Navigator";
import { Providers } from "./providers";
import NetworkStatusClient from "@/components/NetworkStatusClient";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { Link } from "@nextui-org/react";
import Sidebar from "@/components/Navigation/Sidebar";

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
        <Providers>
          <CustomNavbar />
          <div className="sm:ml-16">
            {children}
            <footer className="m-2 text-center mt-5">
              <hr />
              <p className="m-3">
                Powered by{" "}
                <Link isExternal href="https://openf1.org/">OpenF1 API</Link>{" "}
                and{" "}
                <Link isExternal href="https://ergast.com/mrd/">Ergast API</Link>
              </p>
            </footer>
          </div>
          <NetworkStatusClient />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}