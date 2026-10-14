import type { Metadata } from "next";
import { Suspense } from "react";
import JoinTeam from "@/components/join/JoinTeam";

export const metadata: Metadata = {
  alternates: { canonical: "/join" },
  title: "Join your team · BloomBoard",
  description: "You were invited to a team on BloomBoard. Join on the web app, or get the app for Mac or Windows.",
  robots: { index: false, follow: false },
};

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <JoinTeam />
    </Suspense>
  );
}
