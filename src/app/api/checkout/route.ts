import { NextRequest, NextResponse } from "next/server";

/**
 * Bloom and Team checkout → a Polar checkout session.
 *
 * Polar checkout *links* ignore ?seats= and always include the product's own free
 * trial, so when a live API token is configured (POLAR_LIVE_TOKEN, scope
 * checkouts:write) we create the session ourselves:
 *  - Team gets the exact seat count picked on the site.
 *  - "Pay now" (?paynow=1) turns Polar's trial off, so the card is charged today.
 * Without a token, or if Polar errors, we fall back to the checkout link (3-seat
 * minimum and the product's trial apply there).
 */

type Plan = "bloom" | "team";

const LINKS: Record<Plan, { monthly: string; yearly: string }> = {
  bloom: {
    monthly: "https://buy.polar.sh/polar_cl_QgWTHuRDKTmL1Zbv5H71gx43pQz4xslZjF11r3KRCqH",
    yearly: "https://buy.polar.sh/polar_cl_NkBRIKQ7LFBm14kbXoEsK27Nbb6160EOfcG9x2XWUpX",
  },
  team: {
    monthly: "https://buy.polar.sh/polar_cl_uyXu7akul5p5VLDRyR4V5kI4yTBr9OFg3yBxl1xT0By",
    yearly: "https://buy.polar.sh/polar_cl_zWBNmYfNsDNiv8gHfSi8ihjnFYTyBbzrxtY713IF5xQ",
  },
};

const PRODUCTS: Record<Plan, { monthly: string; yearly: string }> = {
  bloom: {
    monthly: process.env.POLAR_BLOOM_MONTHLY_PRODUCT_ID ?? "31ef9e86-934b-4b70-9df6-dc8772a2d26a",
    yearly: process.env.POLAR_BLOOM_YEARLY_PRODUCT_ID ?? "1d8c05e8-b305-4756-b718-280e34a25ac7",
  },
  team: {
    monthly: process.env.POLAR_TEAM_MONTHLY_PRODUCT_ID ?? "c2449b4e-58fd-4711-9709-35351402b8a9",
    yearly: process.env.POLAR_TEAM_YEARLY_PRODUCT_ID ?? "828ab711-88bb-4765-83d3-177b0c301c05",
  },
};

const MIN_SEATS = 3;
const MAX_SEATS = 50;

type Buyer = { email: string; reference: string };

async function createCheckout(productId: string, seats: number | null, payNow: boolean, buyer: Buyer): Promise<string | null> {
  const token = process.env.POLAR_LIVE_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.polar.sh/v1/checkouts/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        products: [productId],
        ...(seats ? { seats } : {}),
        ...(payNow ? { allow_trial: false } : {}),
        ...(buyer.email ? { customer_email: buyer.email } : {}),
        ...(buyer.reference ? { external_customer_id: buyer.reference, metadata: { reference_id: buyer.reference } } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("[checkout] Polar", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch (e) {
    console.warn("[checkout] Polar request failed", e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const plan: Plan = searchParams.get("plan") === "bloom" ? "bloom" : "team";
  const yearly = searchParams.get("yearly") === "1";
  const payNow = searchParams.get("paynow") === "1";
  const seats = plan === "team"
    ? Math.min(MAX_SEATS, Math.max(MIN_SEATS, Math.floor(Number(searchParams.get("quantity")) || MIN_SEATS)))
    : null;

  /* From the sign-up page: the new account's email and id, so the purchase lands on it. */
  const email = (searchParams.get("customer_email") || "").trim().slice(0, 200);
  const reference = (searchParams.get("reference_id") || "").replace(/[^0-9a-f-]/gi, "").slice(0, 36);
  const buyer: Buyer = { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "", reference };

  const billing = yearly ? "yearly" : "monthly";
  const url = await createCheckout(PRODUCTS[plan][billing], seats, payNow, buyer);
  if (url) return NextResponse.redirect(url, 303);

  const q = [
    seats ? `seats=${seats}` : "",
    buyer.email ? `customer_email=${encodeURIComponent(buyer.email)}` : "",
    buyer.reference ? `reference_id=${buyer.reference}` : "",
  ].filter(Boolean).join("&");
  return NextResponse.redirect(`${LINKS[plan][billing]}${q ? `?${q}` : ""}`, 303);
}
