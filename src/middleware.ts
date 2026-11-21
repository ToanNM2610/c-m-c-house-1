import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const rawHost =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ||
    request.headers.get("host") ||
    "";
  const host = rawHost.split(":")[0].toLowerCase();
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes(".local");

  // Check if accessing admin subdomain
  const isAdminSubdomain =
    host === "admin.camcuhouse.online" ||
    host.startsWith("admin.") ||
    (isLocalhost && host.startsWith("admin."));

  // Pass admin header and current pathname downstream so layouts and server components recognize host & route
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", url.pathname);
  if (isAdminSubdomain) {
    requestHeaders.set("x-is-admin-host", "1");
  }

  let response: NextResponse;

  if (isAdminSubdomain) {
    // When on admin subdomain:
    // Root path '/' on admin.camcuhouse.online maps to '/admin'
    if (url.pathname === "/") {
      url.pathname = "/admin";
      response = NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    } else if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next")
    ) {
      url.pathname = `/admin${url.pathname}`;
      response = NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    } else {
      response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
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

    response = NextResponse.next();
  }

  // Security check 1: Protected admin API routes require authenticated session
  if (url.pathname.startsWith("/api/admin") && !url.pathname.startsWith("/api/admin/auth")) {
    const authCookie =
      request.cookies.get("camcu_admin_session")?.value ||
      request.cookies.get("camcu_admin_auth")?.value ||
      request.cookies.get("camcu_auth_session")?.value;

    if (!authCookie) {
      const unauthResponse = NextResponse.json(
        { success: false, error: "Yêu cầu đăng nhập quản trị viên." },
        { status: 401 }
      );
      unauthResponse.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
      return unauthResponse;
    }
  }

  // Security check 2: Protected admin sub-paths require authenticated session
  const protectedAdminPaths = [
    "/admin/integrations",
    "/admin/analytics",
    "/admin/search-console",
  ];

  const isProtectedPath = protectedAdminPaths.some((p) =>
    url.pathname.startsWith(p)
  );

  if (isProtectedPath) {
    const authCookie =
      request.cookies.get("camcu_admin_session")?.value ||
      request.cookies.get("camcu_admin_auth")?.value ||
      request.cookies.get("camcu_auth_session")?.value;

    if (!authCookie) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("from", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin and API security headers: strictly prevent indexing of admin area
  if (isAdminSubdomain || url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  }

  return response;
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
