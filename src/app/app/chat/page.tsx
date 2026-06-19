import { Mic, MessageSquare, UsersRound } from "lucide-react";
import { PhaseTwoCard } from "@/components/webapp/PhaseTwoCard";
import { TeamChatClient } from "@/components/webapp/TeamChatClient";

export default function TeamChatPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(255,255,255,0.035))] p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">
          Team Chat
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Conversations that stay connected to the work.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/52">
          Phase 2 adds direct messages, group conversations, voice notes, image sharing,
          and comment context so teams can move from discussion to action quickly.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <PhaseTwoCard
          title="Direct messages"
          description="Private one-to-one conversations for quick decisions, follow-ups, and lightweight support."
          icon={MessageSquare}
          accent="blue"
        />
        <PhaseTwoCard
          title="Group chat"
          description="Project and team channels for shared discussions, updates, files, and async check-ins."
          icon={UsersRound}
          accent="violet"
        />
        <PhaseTwoCard
          title="Voice and images"
          description="Send voice notes, screenshots, images, and files without losing the board or task context."
          icon={Mic}
          accent="amber"
        />
      </section>

      <TeamChatClient />
    </div>
  );
}
