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
