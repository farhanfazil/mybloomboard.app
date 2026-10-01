import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/trello-connected" },
  title: "Trello connected · BloomBoard",
  robots: { index: false, follow: false },
};

/* Trello sends people here after they allow access. The app normally catches this
   page before it loads; if it didn't, this tells them what to do next. */
export default function TrelloConnected() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 text-center text-[#f5f5f7]">
      <div className="max-w-md">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Trello is connected.</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1aa]">You can close this window and go back to BloomBoard to pick the boards to import.</p>
      </div>
    </main>
  );
}
