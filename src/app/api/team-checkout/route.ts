import { NextRequest, NextResponse } from "next/server";

const POLAR_API   = "https://sandbox-api.polar.sh";
const TOKEN       = process.env.POLAR_ACCESS_TOKEN!;
const PRICE_MONTH = process.env.POLAR_TEAM_MONTHLY_PRICE_ID!;
const PRICE_YEAR  = process.env.POLAR_TEAM_YEARLY_PRICE_ID!;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const quantity = Math.max(3, Number(searchParams.get("quantity")) || 3);
  const yearly   = searchParams.get("yearly") === "1";
  const priceId  = yearly ? PRICE_YEAR : PRICE_MONTH;

  try {
    const res = await fetch(`${POLAR_API}/v1/checkouts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_price_id: priceId,
        seats:     quantity,   // Polar seat-based field (not "quantity")
        min_seats: 3,          // enforces minimum on Polar's checkout page too
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Polar API error:", err);
      return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.redirect(data.url);
  } catch (e) {
    console.error("Polar fetch error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
