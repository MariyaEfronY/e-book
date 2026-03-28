// /lib/withAuth.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, Role, AuthUser } from "./jwt";

// 🔐 Generic Auth Wrapper
export function withAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
  allowedRoles: Role[] = [],
) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await verifyToken(token);

      // 🔒 Role check
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return handler(req, user);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }
  };
}

export const adminOnly = (
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
) => withAuth(handler, ["admin"]);

export const authorOnly = (
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
) => withAuth(handler, ["author"]);

export const userOnly = (
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
) => withAuth(handler, ["user"]);
