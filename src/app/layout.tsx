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
  alternates: { canonical: "/" },
  title: "BloomBoard: Tasks, team chat and a live office in one app",
  description:
    "Your tasks, your team and a live office, in one calm app. Shared boards, team chat and calls, a virtual office and an AI that plans each day. Free to start on Mac, Windows and web.",
  openGraph: {
    title: "BloomBoard: Tasks, team chat and a live office in one app",
    description:
      "Your tasks, your team and a live office, in one calm app. Shared boards, team chat and calls, a virtual office and an AI that plans each day. Free to start on Mac, Windows and web.",
    type: "website",
    siteName: "BloomBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomBoard: Tasks, team chat and a live office in one app",
    description:
      "Your tasks, your team and a live office, in one calm app. Shared boards, team chat and calls, a virtual office and an AI that plans each day. Free to start on Mac, Windows and web.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

const SITE_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "BloomBoard",
      url: "https://mybloomboard.app",
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS, Windows, Web",
      description:
        "A calm productivity app for teams: tasks, boards, calendar, notes, team chat and calls, a live virtual office, and an AI that plans your day.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Bloom", price: "6", priceCurrency: "USD", description: "Per month, billed yearly" },
        { "@type": "Offer", name: "Team", price: "8", priceCurrency: "USD", description: "Per person per month, billed yearly" },
      ],
    },
    { "@type": "Organization", name: "BloomBoard", url: "https://mybloomboard.app", logo: "https://mybloomboard.app/icon.png", email: "hello@mybloomboard.app" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        {/* Tells search engines what BloomBoard is: a free business app for Mac, Windows and the web. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_LD) }} />
        {children}
      </body>
    </html>
  );
}
