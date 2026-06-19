import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mybloomboard.app"),
  title: "BloomBoard — Your day. Organised. Beautiful.",
  description:
    "A personal macOS productivity app that keeps your tasks, goals, streak, meetings, and hydration in one glassy, distraction-free window. Free. Local. No account.",
  openGraph: {
    title: "BloomBoard — Your day. Organised. Beautiful.",
    description:
      "A beautiful macOS productivity app for tasks, streaks, milestones, and hydration. 100% local. No account. Free.",
    type: "website",
    url: "https://mybloomboard.app",
    siteName: "BloomBoard",
    images: [
      {
        url: "/screenshots/Card_Black.jpg",
        width: 2188,
        height: 1638,
        alt: "BloomBoard — macOS productivity app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomBoard — Your day. Organised. Beautiful.",
    description:
      "A beautiful macOS productivity app for tasks, streaks, milestones, and hydration. 100% local. No account. Free.",
    images: ["/screenshots/Card_Black.jpg"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
