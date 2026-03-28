import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // 🧹 Remove auth cookies
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
