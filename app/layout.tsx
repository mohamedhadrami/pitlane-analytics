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
import Footer from "@/components/Footer";

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
            <Footer />
          </div>
          <NetworkStatusClient />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}