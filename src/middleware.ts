import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API v1 routes use their own API key auth
  if (pathname.startsWith("/api/v1/")) return NextResponse.next();

  // Auth routes are always accessible
  if (pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) return NextResponse.next();

  // Dev showcase is public
  if (pathname.startsWith("/dev")) return NextResponse.next();

  // Home page is public
  if (pathname === "/") return NextResponse.next();

  // Internal API routes — let through
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // Protected routes — check for session cookie
  const sessionCookie =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    const signInUrl = new URL("/auth/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
