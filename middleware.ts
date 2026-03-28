import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/author") ||
    pathname.startsWith("/user");

  // ✅ Allow login page always (important)
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // ❌ No token → block dashboard ONLY
  if (!token) {
    if (isDashboard) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const user = await verifyToken(token);
    const role = user.role;

    // 🔒 Role protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    if (pathname.startsWith("/author") && role !== "author") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    if (pathname.startsWith("/user") && role !== "user") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/author/:path*", "/user/:path*"],
};
