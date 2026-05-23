import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloombooard — Your day. Organised. Beautiful.",
  description:
    "A personal macOS productivity app that keeps your tasks, goals, streak, meetings, and hydration in one glassy, distraction-free window. Free. Local. No account.",
  openGraph: {
    title: "Bloombooard — Your day. Organised. Beautiful.",
    description:
      "A beautiful macOS productivity app for tasks, streaks, milestones, and hydration. 100% local. No account. Free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
