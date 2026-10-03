import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import HandoverShowcase from "@/components/showcase/HandoverShowcase";

const Footer = dynamic(() => import("@/components/sections/Footer"));

export const metadata: Metadata = {
  title: "Handover · BloomBoard",
  description:
    "Going on leave? Hand each task to the right teammate with a short note. They accept with one click, and everything comes back to you when you return.",
  alternates: { canonical: "/handover" },
};

export default function HandoverPage() {
  return (
    <main className="bg-black">
      <Header
        logoHref="/"
      />
      <HandoverShowcase />
      <Footer />
    </main>
  );
}
