import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase-server";

/**
 * Private: the quotes people sent from the app (public.app_testimonials). Publish puts a
 * quote on the home page (via /api/quotes) within about five minutes; only quotes where
 * the person ticked "you may show this on the website" can be published.
 * Password-gated in src/middleware.ts (same password as /demo-insights).
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quotes to review", robots: { index: false, follow: false } };

type Row = {
  id: string; created_at: string; quote: string; name: string | null; role: string | null;
  team_name: string | null; user_email: string | null; consent_publish: boolean; status: "new" | "approved" | "declined" | "published";
};

async function setStatus(form: FormData) {
  "use server";
  const id = String(form.get("id") || ""), status = String(form.get("status") || "");
  if (!id || !["new", "declined", "published"].includes(status)) return;
  const db = getSupabaseAdmin();
  if (!db) return;
  /* never publish one the person didn't agree to share */
  let q = db.from("app_testimonials").update({ status }).eq("id", id);
  if (status === "published") q = q.eq("consent_publish", true);
  await q;
  revalidatePath("/quotes-review");
}

const LABEL = { new: "Waiting for you", published: "On the website", declined: "Not used", approved: "Approved" };

export default async function QuotesReview() {
  const db = getSupabaseAdmin();
  const { data } = db
    ? await db.from("app_testimonials").select("id, created_at, quote, name, role, team_name, user_email, consent_publish, status").order("created_at", { ascending: false }).limit(200)
    : { data: [] as Row[] };
  const rows = (data ?? []) as Row[];
  const groups: Row["status"][] = ["new", "published", "declined"];

  return (
    <main className="min-h-screen bg-black px-5 py-16 text-white sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Quotes to review</h1>
        <p className="mt-2 text-white/65">
          Sent from the app. Publish one and it shows on the home page within about five minutes.
          Only quotes the person agreed to share can be published.
        </p>
        {!db ? <p className="mt-8 text-[#fca5a5]">The website can&apos;t reach the database here (no service key).</p> : null}

        {groups.map((g) => {
          const list = rows.filter((r) => (g === "new" ? r.status === "new" || r.status === "approved" : r.status === g));
          return (
            <section key={g} className="mt-12">
              <h2 className="text-lg font-semibold">{LABEL[g]} <span className="font-normal text-white/50">{list.length}</span></h2>
              {!list.length ? <p className="mt-3 text-sm text-white/50">None.</p> : null}
              <div className="mt-4 space-y-3">
                {list.map((r) => (
                  <article key={r.id} className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-5">
                    <p className="text-[17px] leading-relaxed">“{r.quote}”</p>
                    <p className="mt-3 text-sm text-white/70">
                      <b className="font-semibold text-white">{r.name || "No name"}</b>
                      {[r.role, r.team_name].filter(Boolean).length ? `, ${[r.role, r.team_name].filter(Boolean).join(", ")}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {r.user_email ? ` · ${r.user_email}` : ""}
                      {" · "}
                      {r.consent_publish ? <span className="text-[#86efac]">Agreed to be shown on the website</span> : <span className="text-[#fca5a5]">Did not agree to be shown</span>}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.status !== "published" && r.consent_publish ? <Act id={r.id} status="published" primary>Publish on the website</Act> : null}
                      {r.status === "published" ? <Act id={r.id} status="new">Take off the website</Act> : null}
                      {r.status !== "declined" ? <Act id={r.id} status="declined">Don&apos;t use</Act> : <Act id={r.id} status="new">Move back to review</Act>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function Act({ id, status, primary, children }: { id: string; status: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={`h-9 rounded-lg px-3.5 text-sm font-semibold ${primary ? "bg-white text-black hover:bg-white/90" : "border border-white/15 text-white/85 hover:bg-white/[0.06]"}`}
      >
        {children}
      </button>
    </form>
  );
}
