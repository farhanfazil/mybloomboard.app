import type { Metadata } from "next";
import { Suspense } from "react";
import StartFlow from "@/components/start/StartFlow";

export const metadata: Metadata = {
  title: "Sign up · BloomBoard",
  description: "Create your BloomBoard account and start your free trial: 7 days for Bloom, 14 days for Team. No card needed.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Start your free trial · BloomBoard",
    description: "Create your BloomBoard account in a minute. No card needed.",
    url: "/start",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start your free trial · BloomBoard",
    description: "Create your BloomBoard account in a minute. No card needed.",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StartFlow />
    </Suspense>
  );
}
