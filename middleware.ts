import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/secure-access/admin");
  const isLoginPage = req.nextUrl.pathname === "/secure-access/portal";

  // Redirect to login if trying to access admin routes without token
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/secure-access/portal", req.url));
  }

  // Redirect to admin dashboard if trying to access login page while already logged in
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/secure-access/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secure-access/admin/:path*", "/secure-access/portal"],
};
