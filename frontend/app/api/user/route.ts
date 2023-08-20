import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();
  const token = cookieStore.get("userToken");
  const tokenValue = token?.value;

  if (tokenValue) {
    const response = await fetch("http://localhost:5001/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenValue}`,
      },
    });
    const data = await response.json();

    return NextResponse.json(
      { data: data, error: "REDIRECT TO LOGIN" },
      { status: 401 }
    );
  } else {
    return NextResponse.json({ error: "REDIRECT TO LOGIN" }, { status: 401 });
  }
}
