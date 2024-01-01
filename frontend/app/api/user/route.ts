import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchWithAuth } from "../fetchWithAuth";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("userToken")?.value;
    console.log(token);

    const loginUrl = new URL("/login", req.url);
    console.log(req.url);
    console.log(loginUrl);
    
    return NextResponse.redirect(loginUrl);
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
