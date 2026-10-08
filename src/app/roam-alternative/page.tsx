import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FAQSection } from "@/components/ui/faqsection";

const TITLE = "Roam alternative: a virtual office with tasks, boards and AI · BloomBoard";
const DESC =
  "Looking for a Roam alternative? BloomBoard gives your team a live virtual office with rooms, knocks, calls and chat, plus tasks, boards, calendar and AI planning in the same app. Free plan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/roam-alternative" },
  openGraph: { title: TITLE, description: DESC, type: "article", siteName: "BloomBoard" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const OFFICE = [
  ["See who is around", "Everyone's desk shows if they are free, in a room, back later, in focus or on leave, and what they are working on."],
  ["Walk into a room", "Rooms are always there. Walk in and you are talking: no links to send. Share your screen and draw on it."],
  ["Knock first", "Knock on a busy room or person. They choose Come in, Give me 5 or Not now. Knocks wait while someone is in focus."],
  ["Lounge and all hands", "An audio-only lounge for a quick chat, and one big room for the weekly update."],
] as const;

const PLUS = [
  ["Tasks and boards", "Your own task board with priorities, reminders and subtasks, and shared team boards."],
  ["Plan My Day", "Builds your day around meetings, with focus time, breaks and lunch, from the tasks you already have."],
  ["Calendar and email", "Google and Outlook calendars, a Gmail and Outlook inbox, and emails turned into tasks."],
  ["Handover", "Hand your work to a teammate before a vacation, so nothing is dropped."],
] as const;

const FAQS = [
  {
    question: "What is a virtual office?",
    answer:
      "A virtual office is a shared space online where a remote or hybrid team can see who is around and talk instantly, like walking over to a desk, instead of booking a video call for every question.",
  },
  {
    question: "How is BloomBoard different from Roam?",
    answer:
      "Both give your team a virtual office. BloomBoard also includes the work itself: tasks, boards, calendar, notes and an AI that plans your day, so your team does not need a separate task app.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Individuals can use BloomBoard free with no time limit. The live office, chat, calls and shared boards are on the Team plan, from $8 per person a month, billed yearly, with Bloom AI included.",
  },
  {
    question: "Which devices does it work on?",
    answer: "Mac and Windows apps, plus a web app at app.mybloomboard.app that works in any browser.",
  },
];

export default function RoamAlternative() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/email-icon.png" alt="" width={30} height={30} className="rounded-lg" />
          BloomBoard
        </Link>
        <Link href="/start" className="rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-black">Start free</Link>
      </header>
      <main className="mx-auto max-w-[880px] px-5 pb-10 pt-10 text-center md:pt-16">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#9fdcff]">Roam alternative</p>
        <h1 className="mx-auto mt-3 max-w-[760px] text-[34px] font-bold leading-[1.08] tracking-[-0.03em] md:text-[46px]" style={{ textWrap: "balance" }}>A virtual office where the work lives too</h1>
        <p className="mx-auto mt-5 max-w-[640px] text-[16.5px] leading-relaxed text-[#c4c4cc]" style={{ textWrap: "pretty" }}>
          Roam showed how good a virtual office can feel for remote teams. BloomBoard gives you the same feeling of working
          side by side, and puts your tasks, boards, calendar and AI planning in the same app, so your team stops jumping between tools.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/start" className="rounded-[11px] bg-white px-5 py-3 text-[15px] font-semibold text-black">Start free</Link>
          <Link href="/office" className="rounded-[11px] border border-white/15 px-5 py-3 text-[15px] font-semibold">Tour the office</Link>
        </div>

        <section className="mt-16">
          <h2 className="text-[22px] font-bold tracking-[-0.02em]">The live office</h2>
          <div className="mt-6 grid border-t border-white/10 md:grid-cols-2 md:gap-x-10">
            {OFFICE.map(([t, d]) => (
              <div key={t} className="border-b border-white/10 py-5">
                <h3 className="text-[15px] font-bold">{t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#c4c4cc]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-[22px] font-bold tracking-[-0.02em]">Plus everything your team works on</h2>
          <div className="mt-6 grid border-t border-white/10 md:grid-cols-2 md:gap-x-10">
            {PLUS.map(([t, d]) => (
              <div key={t} className="border-b border-white/10 py-5">
                <h3 className="text-[15px] font-bold">{t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#c4c4cc]">{d}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <FAQSection
        className="pb-8 pt-4 md:pt-8"
        subtitle="Questions"
        title="Looking for a Roam alternative?"
        description="What teams ask before they move their office."
        buttonLabel="Start free →"
        buttonHref="/start"
        faqsLeft={FAQS.slice(0, 2)}
        faqsRight={FAQS.slice(2)}
      />
      <nav className="mx-auto max-w-[880px] px-5 pb-24 text-center text-[14px] text-[#a1a1aa]" aria-label="Other comparisons">
        Also compare:{" "}
        <Link href="/vs/trello" className="underline underline-offset-2 hover:text-white">vs Trello</Link> ·{" "}
        <Link href="/vs/clickup" className="underline underline-offset-2 hover:text-white">vs ClickUp</Link> ·{" "}
        <Link href="/vs/notion" className="underline underline-offset-2 hover:text-white">vs Notion</Link> ·{" "}
        <Link href="/vs/monday" className="underline underline-offset-2 hover:text-white">vs monday.com</Link> ·{" "}
        <Link href="/vs/asana" className="underline underline-offset-2 hover:text-white">vs Asana</Link>
      </nav>
    </div>
  );
}
