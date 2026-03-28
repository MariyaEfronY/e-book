import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log(`---------------------------------------------------`);
  console.log(`🛤️  [Middleware] Request Path: ${pathname}`);

  // 1. ✅ Bypass for Login Page
  if (pathname === "/login") {
    console.log(`🔓 [Middleware] Public Route: Allowing /login`);
    return NextResponse.next();
  }

  // 2. 🛡️ Check if path is a Dashboard or API
  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/author") ||
    pathname.startsWith("/user");

  const isApiRoute = pathname.startsWith("/api");

  // 3. ❌ No Token Logic
  if (!token) {
    if (isDashboard) {
      console.log(`🚫 [Middleware] No Token: Redirecting Dashboard to /login`);
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (isApiRoute) {
      console.log(
        `⚠️ [Middleware] No Token for API: Allowing through to let 'authorOnly' handle it`,
      );
      return NextResponse.next();
    }
    console.log(`🔓 [Middleware] No Token: Allowing Public Route`);
    return NextResponse.next();
  }

  // 4. 🔑 Token Verification & Role Protection
  try {
    console.log(`🔑 [Middleware] Token found, verifying...`);
    const user = await verifyToken(token);
    const role = user?.role;

    console.log(`👤 [Middleware] User Role detected: ${role}`);

    // Admin Protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      console.warn(
        `🛑 [Middleware] Access Denied: Admin only. Redirecting to /${role}`,
      );
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    // Author Protection
    if (pathname.startsWith("/author") && role !== "author") {
      console.warn(
        `🛑 [Middleware] Access Denied: Author only. Redirecting to /${role}`,
      );
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    // User Protection
    if (pathname.startsWith("/user") && role !== "user") {
      console.warn(
        `🛑 [Middleware] Access Denied: User only. Redirecting to /${role}`,
      );
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    console.log(`✅ [Middleware] Authorization Successful. Proceeding...`);
    return NextResponse.next();
  } catch (error) {
    console.error(`🔥 [Middleware] Token Validation Failed:`, error);
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}

// Ensure the matcher includes all your protected zones
export const config = {
  matcher: [
    "/admin/:path*",
    "/author/:path*",
    "/user/:path*",
    "/api/:path*", // Matches all API routes
  ],
};
