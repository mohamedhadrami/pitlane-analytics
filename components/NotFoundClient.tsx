// components/NotFoundClient.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Divider, Button } from "@heroui/react";

export default function NotFoundClient() {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)] space-y-20">
      <div className="text-center flex space-x-4 text-4xl font-extralight">
        <h1>404</h1>
        <Divider orientation="vertical" />
        <h1>Not Found</h1>
      </div>
      <Image src="/checkered-wave-flag.png" width={500} height={500} alt="logo" />
      <Link href="/" passHref>
        <Button
          as="a"
          radius="sm"
          className="bg-gradient-to-tr from-[#e10600] to-black-500 text-white shadow-lg"
        >
          Return Home
        </Button>
      </Link>
    </div>
  );
}
