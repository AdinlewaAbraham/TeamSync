import getTokenExpiration from "@/utilis/getTokenExpiration";
import { hasExpired } from "@/utilis/hasExpired";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function fetchWithAuth(
  url: string,
  options: RequestInit,
): Promise<any> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      console.log("no tokens");
      return { data: { message: "REDIRECT_TO_LOGIN" }, status: 401 };
    }

    const accessTokenExpirationDate = accessToken
      ? getTokenExpiration(accessToken)
      : null;
    const refreshTokenExpirationDate = getTokenExpiration(refreshToken);

    if (!refreshTokenExpirationDate) {
      console.log("no tokens date");
      return { data: { message: "REDIRECT_TO_LOGIN" }, status: 401 };
    }

    if (hasExpired(refreshTokenExpirationDate)) {
      console.log("refresh expired");

      return { data: { message: "REDIRECT_TO_LOGIN" }, status: 401 };
    }

    let token;
    if (!accessTokenExpirationDate || hasExpired(accessTokenExpirationDate)) {
      console.log("your token has expired nigga");
      const res = await axios.post(process.env.API_HOST + "/auth/refresh", {
        refreshToken,
      });
      if (res.status === 200) {
        const accessToken = res.data?.accessToken;
        token = accessToken;
        const expirationDate = getTokenExpiration(accessToken);
        cookieStore.set("access_token", accessToken, {
          secure: true,
          httpOnly: true,
          sameSite: "strict",
          ...(expirationDate ? { expires: expirationDate } : {}),
        });
      }
    }

    token = token ? token : cookieStore.get("access_token")?.value;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const fetchURL = url.startsWith("http") ? url : process.env.API_HOST + url;
    const response = await fetch(fetchURL, {
      ...options,
      headers,
    });

    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    console.error(error);
    return { data: { message: "internal error", status: 500 } };
  }
}
