import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FAQSection } from "@/components/ui/faqsection";

/* BloomBoard for Claude (2026-11-25): the public setup and help page for the connector at
   mcp.mybloomboard.app (desktop repo mcp/). Anthropic's directory links here as the documentation URL. */

const URL = "https://mcp.mybloomboard.app/mcp";

export const metadata: Metadata = {
  alternates: { canonical: "/claude" },
  title: "Use BloomBoard with Claude · BloomBoard",
  description: "Connect BloomBoard to Claude and ask about your tasks, boards and plans, create tasks from notes, and approve work, right from a chat.",
};

const STEPS = [
  "In Claude (claude.ai or the Claude app), open Settings, then Connectors.",
  "Choose Add custom connector. Name it BloomBoard and paste the link below as the MCP server URL. Leave the rest as it is and press Continue.",
  "Sign in to BloomBoard if asked. Read what Claude may do and press Allow.",
  "Back in Claude, ask something like \"What's waiting for my review in BloomBoard?\"",
];

const ASK = [
  "What's overdue for me this week?",
  "Turn these meeting notes into tasks for Maya and Sam, due Friday.",
  "What is waiting for my review? Approve the homepage banner.",
  "Send the launch post back to Sam: shorter intro, add the price.",
  "Move the poster card on the Marketing board to Done.",
  "What's in the December content plan that is not posted yet?",
  "Who is on leave next week, and what are they working on?",
  "Comment on the brochure task: looks good, @Maya can you check the dates?",
];

const CAN = [
  { title: "Reads", body: "Your tasks, tasks you gave, the review queue, boards and cards, plans, meetings, who is on leave, your BloomBoard notifications, and search." },
  { title: "Writes", body: "Creates and updates tasks and cards, adds and ticks subtasks, comments with @mentions, approves work or sends it back with notes. Teammates are told, the same as when you do it in the app." },
  { title: "Never", body: "Deletes anything, reads your team chat or calls, or touches billing. These are blocked in our database for every connected app, not only in the connector." },
];

const FAQ_LEFT = [
  {
    question: "What can Claude see?",
    answer: "Only what you can see in BloomBoard: your own tasks, tasks given to you or by you, your team's boards, plans you can open, meetings you are in and shared leave. Each request runs as you, under the same rules as the app.",
  },
  {
    question: "Will Claude change things without asking?",
    answer: "Claude acts when you ask it to, and depending on your Claude settings it asks before using BloomBoard. Every change shows up as you, with the usual notifications, so your team always sees what happened.",
  },
  {
    question: "Which plans include it?",
    answer: "Every BloomBoard account, Free and paid. You need a Claude plan that supports custom connectors.",
  },
];

const FAQ_RIGHT = [
  {
    question: "How do I disconnect it?",
    answer: "In BloomBoard, open Connected apps and press Disconnect on Claude. Access stops straight away. You can also remove the connector in Claude's settings.",
  },
  {
    question: "Is my data used to train AI?",
    answer: "We never share your data for training. What Claude reads from BloomBoard becomes part of your Claude chat and is handled under Anthropic's privacy policy and your Claude settings. See section 6 of our Privacy Policy.",
  },
  {
    question: "Something doesn't work?",
    answer: "Try removing the connector in Claude and connecting again. Still stuck? Write to support@mybloomboard.app and tell us what you asked Claude.",
  },
];

export default function ClaudePage() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <header className="mx-auto flex max-w-[1120px] items-center px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/brand/mark-on-dark-tight.svg" alt="" width={25} height={30} unoptimized />
          BloomBoard
        </Link>
      </header>
      <main className="mx-auto max-w-[720px] px-5 pb-10 pt-10 md:pt-16">
        <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Use BloomBoard with Claude</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[#c4c4cc]">
          Connect BloomBoard to Claude and run your work from a chat: ask what is due, turn notes into tasks, approve work and move cards, without opening the app.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-bold">Connect in four steps</h2>
          <ol className="mt-3 flex flex-col gap-2.5 text-[15.5px] leading-relaxed text-[#c4c4cc]">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-3"><span className="w-5 flex-none font-bold text-[#f5f5f7]">{i + 1}</span><span>{s}</span></li>
            ))}
          </ol>
          <div className="mt-4 rounded-[10px] border border-[#2a2a2e] px-4 py-3">
            <p className="text-[13px] text-[#a1a1aa]">MCP server URL</p>
            <code className="mt-1 block break-all font-mono text-[15px]">{URL}</code>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold">What Claude can do</h2>
          <div className="mt-3 flex flex-col gap-4">
            {CAN.map((c) => (
              <div key={c.title}>
                <h3 className="text-[15.5px] font-bold">{c.title}</h3>
                <p className="mt-1 text-[15.5px] leading-relaxed text-[#c4c4cc]">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold">Things to ask</h2>
          <ul className="mt-3 flex flex-col gap-2 text-[15.5px] leading-relaxed text-[#c4c4cc]">
            {ASK.map((a) => <li key={a}>&ldquo;{a}&rdquo;</li>)}
          </ul>
        </section>
      </main>
      <FAQSection
        className="pb-8 pt-4 md:pt-8"
        subtitle="Questions"
        title="BloomBoard and Claude, answered plainly"
        description="What it can see, what it can change, and how to switch it off."
        buttonLabel="Ask us anything →"
        buttonHref="mailto:hello@mybloomboard.app"
        faqsLeft={FAQ_LEFT}
        faqsRight={FAQ_RIGHT}
      />
      <p className="mx-auto max-w-[720px] px-5 pb-24 text-sm text-[#a1a1aa]">
        See also our <a href="/privacy.html#claude" className="underline">Privacy Policy</a> and <a href="/security" className="underline">Security and your data</a>.
      </p>
    </div>
  );
}
