import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("userToken")?.value;
    const response = await fetch(process.env.API_HOST + "/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(error);
  }
}
