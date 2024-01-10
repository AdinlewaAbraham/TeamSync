import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../../fetchWithAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log(params.id);
  console.log("i have hit this endpoint");
  try {
    const url = process.env.API_HOST + "/project/" + params.id;

    const postBody = await req.json();
    const { data, status } = await fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(postBody),
    });
    console.log(data, status);
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
  }
}
