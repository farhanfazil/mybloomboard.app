import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    "A calm productivity app for Mac, Windows and iPhone: tasks, boards, notes, team chat and calls, with an AI that plans your day. Free for solo use, with no account and no cloud.",
  openGraph: {
    title: "BloomBoard — Your day. Organised. Beautiful.",
    description:
      "A calm productivity app for Mac, Windows and iPhone: tasks, boards, notes, team chat and calls, with an AI that plans your day. Free for solo use, with no account and no cloud.",
    type: "website",
    url: "https://mybloomboard.app",
    siteName: "BloomBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomBoard — Your day. Organised. Beautiful.",
    description:
      "A calm productivity app for Mac, Windows and iPhone: tasks, boards, notes, team chat and calls, with an AI that plans your day. Free for solo use, with no account and no cloud.",
  },
  icons: {
    icon: "/favicon.png",
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
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
