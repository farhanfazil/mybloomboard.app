import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import WorkShowcase from "@/components/showcase/WorkShowcase";

const Footer = dynamic(() => import("@/components/sections/Footer"));

export const metadata: Metadata = {
  title: "Tasks & Boards · BloomBoard",
  description:
    "Tasks are your own list for today. Boards are where the team works on projects together. See how they fit in BloomBoard.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="bg-black">
      <Header
        logoHref="/"
      />
      <WorkShowcase />
      <Footer />
    </main>
  );
}
