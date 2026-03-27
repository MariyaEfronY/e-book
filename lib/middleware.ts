// /lib/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AuthUser, Role } from "./auth";

// 🔥 Generic middleware wrapper
export const withAuth = (
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
  allowedRoles?: Role[],
) => {
  return async (req: NextRequest) => {
    try {
      // 📥 Get token
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized: No token" },
          { status: 401 },
        );
      }

      const token = authHeader.split(" ")[1];

      // 🔐 Verify token
      const user = verifyToken(token);

      // 🔒 Role check
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: "Forbidden: Access denied" },
          { status: 403 },
        );
      }

      // ✅ Continue to actual handler
      return await handler(req, user);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Unauthorized" },
        { status: 401 },
      );
    }
  };
};
