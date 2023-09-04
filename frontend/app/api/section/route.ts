import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../fetchWithAuth";

export async function POST(req: NextRequest) {
  const postBody = await req.json();
  const url = process.env.API_HOST + "/section/";
  const { data, status } = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(postBody),
  });

  return NextResponse.json(data, { status: status });
}
