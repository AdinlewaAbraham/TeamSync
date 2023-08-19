import { NextRequest, NextResponse } from "next/server";

const dataSource = "http://localhost:5001/auth/google";
export async function GET(req: NextRequest, res: NextResponse) {
  const body = await res.json();
  console.log(body);
}
