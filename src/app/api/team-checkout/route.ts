import { NextRequest, NextResponse } from "next/server";

const MONTHLY_LINK = "https://buy.polar.sh/polar_cl_uyXu7akul5p5VLDRyR4V5kI4yTBr9OFg3yBxl1xT0By";
const YEARLY_LINK  = "https://buy.polar.sh/polar_cl_zWBNmYfNsDNiv8gHfSi8ihjnFYTyBbzrxtY713IF5xQ";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const quantity = Math.max(3, Number(searchParams.get("quantity")) || 3);
  const yearly   = searchParams.get("yearly") === "1";
  const base     = yearly ? YEARLY_LINK : MONTHLY_LINK;
  return NextResponse.redirect(`${base}?seats=${quantity}`);
}
