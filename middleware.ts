import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/secure-access/admin");
  const isLoginPage = req.nextUrl.pathname === "/secure-access/portal";

  const token_user = req.cookies.get("visitorToken")?.value;
  const isVisitorRoute = req.nextUrl.pathname.startsWith("/user_dashboard");
  const isVisitorPage = req.nextUrl.pathname === "/pages/auth/login";
  

  // Redirect to login if trying to access admin routes without token
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/secure-access/portal", req.url));
  }

  // Redirect to login if trying to access visitor routes without token
  if (isVisitorRoute && !token_user) {
    return NextResponse.redirect(new URL("/pages/auth/login", req.url));
  }

  // Redirect to admin dashboard if trying to access login page while already logged in
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/secure-access/admin", req.url));
  }

  // Redirect to visitor dashboard if trying to access login page while already logged in
  if (isVisitorPage && token_user) {
    return NextResponse.redirect(new URL("/user_dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secure-access/admin/:path*", "/secure-access/portal", "/user_dashboard/:path*", "/pages/auth/login", "/pages/user_bookings", "/pages/analytics", "/pages/notifications", "/pages/settings"],
};
