import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../fetchWithAuth";

export async function POST(req: NextRequest) {
  const url = process.env.API_HOST + "/task/";
  const postBody = await req.json();
  const { data, status } = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(postBody),
  });

  return NextResponse.json(data, { status });
}
