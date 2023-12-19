import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../../fetchWithAuth";

export async function PUT(req: NextRequest, res: NextResponse) {
  console.log("postBody");
  try {
    const url = process.env.API_HOST + "/project/updateprojectdescription";

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
