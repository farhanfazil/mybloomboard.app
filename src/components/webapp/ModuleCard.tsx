import { ArrowUpRight } from "lucide-react";

export function ModuleCard({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <article className="group rounded-[28px] border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-300/35 hover:bg-white/[0.055]">
      <div className="mb-8 flex items-start justify-between gap-4">
        <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
          {phase}
        </span>
        <ArrowUpRight className="h-5 w-5 text-white/25 transition group-hover:text-blue-200" />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-4 text-base leading-7 text-white/50">{description}</p>
    </article>
  );
}
