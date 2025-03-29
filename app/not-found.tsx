// app/not-found.tsx

import type { Metadata } from "next";
import NotFoundClient from "@/components/NotFoundClient";

export const metadata: Metadata = {
  title: "Not Found",
  description: "This page doesn't exist",
};

export default function NotFound() {
  return <NotFoundClient />;
}
