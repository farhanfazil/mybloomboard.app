import { MessageSquare, ShieldCheck, UserRoundPlus, Users } from "lucide-react";
import { PhaseTwoCard } from "@/components/webapp/PhaseTwoCard";
import { TeamWorkspaceClient } from "@/components/webapp/TeamWorkspaceClient";
import { phaseTwoHighlights } from "@/lib/webapp/config";

const cards = [
  {
    title: "Invite members",
    description:
      "Add teammates by email, assign roles, and prepare every user for synced tasks, boards, chat, and reporting.",
    icon: UserRoundPlus,
    accent: "blue" as const,
  },
  {
    title: "Role-based access",
    description:
      "Owners, managers, members, and clients each get the right level of access for the workspace.",
    icon: ShieldCheck,
    accent: "green" as const,
  },
  {
    title: "Team collaboration",
    description:
      "Keep comments, mentions, group chat, voice notes, and attachments connected to the work itself.",
    icon: MessageSquare,
    accent: "violet" as const,
  },
];

export default function TeamWorkspacePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[36px] border border-white/10 bg-white/[0.035] p-6 sm:p-10 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
            Phase 2
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Team workspace, roles, and collaboration.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/52">
            This is the collaboration layer for Bloomboard teams. It connects people,
            projects, cards, comments, chat, voice notes, reports, and manager signals
            inside one shared workspace.
          </p>
        </div>

        <TeamWorkspaceClient />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <PhaseTwoCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {phaseTwoHighlights.map((item) => (
          <article key={item.title} className="rounded-[24px] border border-white/10 bg-black/35 p-5">
            <Users className="mb-4 h-5 w-5 text-blue-200" />
            <h3 className="font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/48">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
