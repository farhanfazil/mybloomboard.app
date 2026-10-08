import { TEMPLATES, template, templateBoardFile } from "@/lib/templates";

export const dynamic = "force-static";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

/* The template as a board file BloomBoard imports (My Boards, Import). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = template(slug);
  if (!t) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(templateBoardFile(t), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="bloomboard-${t.slug}.json"`,
    },
  });
}
