import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // If accessing the portal-camcu-2610 route (or its subroutes)
  if (request.nextUrl.pathname.startsWith("/portal-camcu-2610")) {
    const authCookie = request.cookies.get("camcu_auth_session");

    // If there's no auth cookie, and they are trying to access a subroute, redirect them to the portal login
    if (!authCookie && request.nextUrl.pathname !== "/portal-camcu-2610") {
      return NextResponse.redirect(new URL("/portal-camcu-2610", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal-camcu-2610/:path*"],
};
