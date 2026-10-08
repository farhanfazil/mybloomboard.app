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
  title: "BloomBoard: Your day. Organised. Beautiful.",
  description:
    "A calm productivity app for Mac and Windows: tasks, boards, notes, team chat and calls, with an AI that plans your day. Free for solo use, no account needed.",
  openGraph: {
    title: "BloomBoard: Your day. Organised. Beautiful.",
    description:
      "A calm productivity app for Mac and Windows: tasks, boards, notes, team chat and calls, with an AI that plans your day. Free for solo use, no account needed.",
    type: "website",
    siteName: "BloomBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomBoard: Your day. Organised. Beautiful.",
    description:
      "A calm productivity app for Mac and Windows: tasks, boards, notes, team chat and calls, with an AI that plans your day. Free for solo use, no account needed.",
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
      operatingSystem: "macOS, Windows, Web, iOS",
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
        {/* Tells search engines what BloomBoard is: a free business app for Mac, Windows, web and iPhone. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_LD) }} />
        {children}
      </body>
    </html>
  );
}
