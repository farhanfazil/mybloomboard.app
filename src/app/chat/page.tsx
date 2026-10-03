import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import ChatShowcase from "@/components/showcase/ChatShowcase";

const Footer = dynamic(() => import("@/components/sections/Footer"));

export const metadata: Metadata = {
  title: "Chat · BloomBoard",
  description:
    "Team chat right next to your work: rooms and direct messages with reactions, GIFs, voice notes, files, replies and calls.",
  alternates: { canonical: "/chat" },
};

export default function ChatPage() {
  return (
    <main className="bg-black">
      <Header
        logoHref="/"
      />
      <ChatShowcase />
      <Footer />
    </main>
  );
}
