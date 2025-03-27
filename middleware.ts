import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Add your middleware logic here
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Add your route patterns here
  ],
}; 