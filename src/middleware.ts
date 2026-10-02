import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes(".local");

  // Check if accessing admin subdomain
  const isAdminSubdomain =
    host === "admin.camcuhouse.online" ||
    host.startsWith("admin.") ||
    (isLocalhost && host.startsWith("admin."));

  if (isAdminSubdomain) {
    // When on admin subdomain:
    // Root path '/' on admin.camcuhouse.online maps to '/admin'
    if (url.pathname === "/") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    // If accessing path without /admin prefix (and not API or static): rewrite to /admin/...
    if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next")
    ) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else {
    // When on main domain (camcuhouse.online or www.camcuhouse.online):
    // In production, redirect /admin directly to https://admin.camcuhouse.online
    const isMainProductionDomain =
      host.includes("camcuhouse.online") && !isAdminSubdomain;

    if (
      isMainProductionDomain &&
      (url.pathname === "/admin" || url.pathname.startsWith("/admin/"))
    ) {
      const redirectUrl = new URL("https://admin.camcuhouse.online");
      const subpath = url.pathname.replace(/^\/admin/, "");
      if (subpath && subpath !== "/") {
        redirectUrl.pathname = subpath;
      }
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  // Preserve legacy portal protection if accessed
  if (url.pathname.startsWith("/portal-camcu-2610")) {
    const authCookie = request.cookies.get("camcu_auth_session");
    if (!authCookie && url.pathname !== "/portal-camcu-2610") {
      return NextResponse.redirect(new URL("/portal-camcu-2610", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files:
     * - _next/static, _next/image, favicon.ico, images, fonts
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2)$).*)",
  ],
};
