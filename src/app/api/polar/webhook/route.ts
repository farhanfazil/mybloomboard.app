/** Older Polar webhook address (Polar still has it as "BloomBoard website"). Plans are switched on by the
    app's own webhook (Supabase polar-webhook), so this one only says "received" and does nothing,
    instead of Polar logging a failed delivery for every payment. */
export async function POST() {
  return new Response("ok", { status: 200 });
}
