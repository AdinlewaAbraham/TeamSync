import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchWithAuth } from "../fetchWithAuth";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const url = process.env.API_HOST + "/workspace/";
    const postBody = await req.json();
    const { data, status } = await fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    // console.log(postBody);
    // console.log(data);
    return NextResponse.json(data, { status });
  } catch (err) {
    console.error(err);
  }
}
export async function PUT(req: NextRequest, res: NextResponse) {}
export async function GET(req: NextRequest, res: NextResponse) {}
export async function DELETE(req: NextRequest, res: NextResponse) {}
