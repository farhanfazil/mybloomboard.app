import { NextRequest, NextResponse } from "next/server";

/**
 * "Start team plan" → Polar checkout with the seat count picked on the site.
 *
 * Polar checkout *links* ignore a ?seats= parameter, so when a live API token is
 * configured (POLAR_LIVE_TOKEN, scope checkouts:write) we create the checkout
 * session ourselves with the exact seats. Without a token, or if Polar errors,
 * we fall back to the checkout link; the product's own 3-seat minimum in Polar
 * still applies there.
 */

const MONTHLY_LINK = "https://buy.polar.sh/polar_cl_uyXu7akul5p5VLDRyR4V5kI4yTBr9OFg3yBxl1xT0By";
const YEARLY_LINK  = "https://buy.polar.sh/polar_cl_zWBNmYfNsDNiv8gHfSi8ihjnFYTyBbzrxtY713IF5xQ";

const MONTHLY_PRODUCT = process.env.POLAR_TEAM_MONTHLY_PRODUCT_ID ?? "c2449b4e-58fd-4711-9709-35351402b8a9";
const YEARLY_PRODUCT  = process.env.POLAR_TEAM_YEARLY_PRODUCT_ID ?? "828ab711-88bb-4765-83d3-177b0c301c05";

const MIN_SEATS = 3;
const MAX_SEATS = 50;

async function createCheckout(productId: string, seats: number): Promise<string | null> {
  const token = process.env.POLAR_LIVE_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.polar.sh/v1/checkouts/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ products: [productId], seats }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("[team-checkout] Polar", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch (e) {
    console.warn("[team-checkout] Polar request failed", e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const requested = Math.floor(Number(searchParams.get("quantity")) || MIN_SEATS);
  const seats = Math.min(MAX_SEATS, Math.max(MIN_SEATS, requested));
  const yearly = searchParams.get("yearly") === "1";

  const url = await createCheckout(yearly ? YEARLY_PRODUCT : MONTHLY_PRODUCT, seats);
  return NextResponse.redirect(url ?? `${yearly ? YEARLY_LINK : MONTHLY_LINK}?seats=${seats}`, 303);
}
