import type { Metadata } from "next";
import { Suspense } from "react";
import JoinTeam from "@/components/join/JoinTeam";

export const metadata: Metadata = {
  alternates: { canonical: "/join" },
  title: "Join your team · BloomBoard",
  description: "You were invited to a team on BloomBoard. Open the app or download it, then enter your invite code.",
  robots: { index: false, follow: false },
};

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <JoinTeam />
    </Suspense>
  );
}
