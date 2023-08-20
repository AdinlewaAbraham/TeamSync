import { NextRequest, NextResponse } from "next/server";

const dataSource = "http://localhost:5001/auth/google";
export async function GET(req: NextRequest, res: Response) {
  try {
    // Redirect user to your Express.js backend's Google authentication endpoint
    // window.open(dataSource);
    // window.open("http://localhost:5001/auth/google", "_self");
 
    return NextResponse.redirect("http://localhost:5001/auth/google");
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
