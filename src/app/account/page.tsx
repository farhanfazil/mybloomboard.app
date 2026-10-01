import type { Metadata } from "next";
import AccountFlow from "@/components/account/AccountFlow";

export const metadata: Metadata = {
  title: "Manage subscription · BloomBoard",
  description: "Sign in with an email code to see your BloomBoard plan, add a card, or manage billing.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/account" },
};

export default function AccountPage() {
  return <AccountFlow />;
}
