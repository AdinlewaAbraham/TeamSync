import getTokenExpiration from "@/utilis/getTokenExpiration";
import axios from "axios";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = process.env.API_HOST + "/auth/google/";
    console.log(url)
    const { data, status } = await axios.post(url, await req.json());

    const cookieStore = cookies();
    if (status === 200) {
      const tokens = data.tokens;

      const setCookie = (key: string, value: string) => {
        const expirationDate = getTokenExpiration(value);

        cookieStore.set(key, value, {
          secure: true,
          httpOnly: true,
          sameSite: "strict",
          ...(expirationDate ? { expires: expirationDate } : {}),
        });
      };

      setCookie("access_token", tokens.access);
      setCookie("refresh_token", tokens.refresh);
    }

    const returnData = status === 200 ? data.user : data;
    return NextResponse.json(returnData, { status });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
