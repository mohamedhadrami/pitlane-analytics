
"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import React from "react";
import CustomNavbar from "@/components/CustomNavbar";
import { Link } from "@nextui-org/react";


const inter = Inter({ subsets: ["latin"] });

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
      </body>
    </html>
  );
}
