"use server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchWithAuth } from "../fetchWithAuth";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { data, status } = await fetchWithAuth("/user/", {
      method: "GET",
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
  }
}
export async function PUT(req: NextRequest, res: NextResponse) {
  console.log("postBody");
  try {
    const url = process.env.API_HOST + "/user/";

    const postBody = await req.json();
    const { data, status } = await fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(postBody),
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
