import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // URL query parameter authentication has been removed for security.
  // Passwords in URLs appear in browser history, server logs, and Referer headers.
  // Authentication is now handled via the POST /api endpoint and cookies only.

  // Let the request continue - AuthContext will handle showing the login form
  // if the user doesn't have a valid cookie.
  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*"],
};
