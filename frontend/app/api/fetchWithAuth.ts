import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function fetchWithAuth(
  url: string,
  options: RequestInit,
): Promise<any> {
  try {
    console.log(url);

    const cookieStore = cookies();
    const token = cookieStore.get("userToken")?.value;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };
    const response = await fetch(url, { ...options, headers });
    console.log(response);

    const data = await response.json();
    console.log(data);

    // if (!response.ok) {
    //   console.log("something is wrong wih your response check fetchWithAuth this is your status     " + response.status );
    // }

    return { data, status: response.status };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
}
