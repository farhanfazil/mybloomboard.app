import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import OfficeShowcase from "@/components/showcase/OfficeShowcase";

const Footer = dynamic(() => import("@/components/sections/Footer"));

export const metadata: Metadata = {
  title: "The Office · BloomBoard",
  description:
    "A live map of your team. See who's free, knock before you interrupt, and walk into a room to talk. No meeting links.",
  alternates: { canonical: "/office" },
};

export default function OfficePage() {
  return (
    <main className="bg-black">
      <Header
        logoHref="/"
      />
      <OfficeShowcase />
      <Footer />
    </main>
  );
}
