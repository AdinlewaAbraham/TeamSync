import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../../fetchWithAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = process.env.API_HOST + "/project/" + params.id;
    const { data, status } = await fetchWithAuth(url, {
      method: "GET",
    });
    return NextResponse.json(data, { status: status });
  } catch (error) {
    console.log(error);
  }
}
