import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../../fetchWithAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const url = process.env.API_HOST + "/task/" + params.id;
  try {
    const { data, status } = await fetchWithAuth(url, {
      method: "GET",
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const url = process.env.API_HOST + "/task/" + params.id;
  console.log(url);
  try {
    const { data, status } = await fetchWithAuth(url, {
      method: "DELETE",
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const url = process.env.API_HOST + "/task/" + params.id;
  console.log(url);
  const body = await req.json();
  try {
    const { data, status } = await fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(body)
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
  }
}
