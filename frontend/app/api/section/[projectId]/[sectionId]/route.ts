import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "../../../fetchWithAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string; sectionId: string } }
) {
  const url =
    process.env.API_HOST +
    "/section/" +
    params.projectId +
    "/" +
    params.sectionId;
  const { data, status } = await fetchWithAuth(url, {
    method: "DELETE",
  });

  return NextResponse.json(data, { status: status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string; sectionId: string } }
) {
  const postBody = await req.json();
  const url = process.env.API_HOST + "/section/" + params.sectionId;
  const { data, status } = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(postBody),
  });

  return NextResponse.json(data, { status: status });
}
