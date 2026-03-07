import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigator from "@/components/Navigation/Navigator";
import { Providers } from "./providers";
import NetworkStatusClient from "@/components/NetworkStatusClient";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Pitlane Analytics",
    template: "%s | Pitlane Analytics",
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
      <body
        className={`${inter.className} bg-layer`}
      >

        <Providers>
          <Navigator />
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