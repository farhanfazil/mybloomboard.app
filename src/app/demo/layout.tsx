import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/demo" },
  title: "Try the BloomBoard Live Demo",
  description:
    "Try BloomBoard in your browser. Create tasks, boards, bookmarks, and meetings with the real app UI.",
  openGraph: {
    title: "Try the BloomBoard Live Demo",
    description:
      "Try BloomBoard in your browser. Create tasks, boards, bookmarks, and meetings with the real app UI.",
    type: "website",
    url: "https://mybloomboard.app/demo",
    siteName: "BloomBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Try the BloomBoard Live Demo",
    description:
      "Try BloomBoard in your browser. Create tasks, boards, bookmarks, and meetings with the real app UI.",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
