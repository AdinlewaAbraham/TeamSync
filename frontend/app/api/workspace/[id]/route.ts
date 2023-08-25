import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchWithAuth } from "../../fetchWithAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = process.env.API_HOST + "/workspace/" + params.id;
    const { data, status } = await fetchWithAuth(url, {
      method: "GET",
    });
    return NextResponse.json(data, { status });
  } catch (err) {
    console.error(err);
  }
}
