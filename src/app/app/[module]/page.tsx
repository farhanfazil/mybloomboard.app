import { ModuleCard } from "@/components/webapp/ModuleCard";
import { webAppModules } from "@/lib/webapp/config";

export default function WebAppModulePage({
  params,
}: {
  params: { module: string };
}) {
  const section = params.module.replaceAll("-", " ");

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
          Web App Module
        </p>
        <h2 className="mt-3 text-4xl font-black capitalize tracking-tight sm:text-5xl">
          {section}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/50">
          This route is reserved for the synced Bloomboard web app. It will connect to
          Supabase, respect plan entitlements, and share state with the desktop app.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {webAppModules.slice(0, 3).map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </div>
    </div>
  );
}
