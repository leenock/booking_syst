import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminToken = req.cookies.get("adminToken")?.value;
  const visitorToken = req.cookies.get("visitorToken")?.value;

  const path = req.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/secure-access/admin");
  const isAdminLoginPage = path === "/secure-access/portal";

  const isVisitorDashboard = path.startsWith("/user_dashboard");
  const isVisitorLoginPage = path === "/pages/auth/login";

  const isProtectedVisitorPage = [
    "/pages/user_bookings",
    "/pages/analytics",
    "/pages/notifications",
    "/pages/settings",
  ].some((route) => path.startsWith(route));

  // Redirect to admin login if trying to access admin route without admin token
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL("/secure-access/portal", req.url));
  }

  // Redirect to visitor login if trying to access protected visitor areas without visitor token
  if ((isVisitorDashboard || isProtectedVisitorPage) && !visitorToken) {
    return NextResponse.redirect(new URL("/pages/auth/login", req.url));
  }

  // Prevent access to admin login if already logged in as admin
  if (isAdminLoginPage && adminToken) {
    return NextResponse.redirect(new URL("/secure-access/admin", req.url));
  }

  // Prevent access to visitor login if already logged in
  if (isVisitorLoginPage && visitorToken) {
    return NextResponse.redirect(new URL("/user_dashboard", req.url));
  }

  return NextResponse.next();
}

// Define all protected paths
export const config = {
  matcher: [
    "/secure-access/admin/:path*",
    "/secure-access/portal",
    "/user_dashboard/:path*",
    "/pages/user_bookings",
    "/pages/analytics",
    "/pages/notifications",
    "/pages/settings",
    "/pages/auth/login",
  ],
};
