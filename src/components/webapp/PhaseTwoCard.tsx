import { LucideIcon } from "lucide-react";

const accents = {
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-200",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
} as const;

type Accent = keyof typeof accents;

export function PhaseTwoCard({
  title,
  description,
  icon: Icon,
  accent = "blue",
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: Accent;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]">
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/52">{description}</p>
    </article>
  );
}
