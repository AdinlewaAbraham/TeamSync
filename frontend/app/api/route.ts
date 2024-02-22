import { NextRequest, NextResponse } from "next/server";

const dataSource = "http://localhost:5001/";
export async function GET(req: NextRequest, res: NextResponse) {
  console.log("you might me");
  const response = await fetch(dataSource, { method: "GET" });
  return NextResponse.json({ mess: "sup my niggs" });
}
