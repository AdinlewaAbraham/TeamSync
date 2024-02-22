import { NextRequest, NextResponse } from "next/server";

const dataSource = "http://localhost:5001/auth/google";
export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ mess: "sup my niggs" });
}
