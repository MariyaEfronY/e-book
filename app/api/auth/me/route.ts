import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest, user) => {
  return NextResponse.json({
    success: true,
    user: {
      id: user.name,
      role: user.role,
    },
  });
});
