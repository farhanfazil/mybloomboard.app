import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try BloomBoard — Live Demo",
  description:
    "Try BloomBoard in your browser. Create tasks, boards, bookmarks, and meetings with the real app UI.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
