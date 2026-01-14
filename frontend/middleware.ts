import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/refresh"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

const DASHBOARD_PATH_PREFIXES = [
  "/dashboard",
  "/calls",
  "/live",
  "/team",
  "/settings",
];

function isProtectedPath(pathname: string) {
  return DASHBOARD_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const isLoggedIn = !!accessToken;

  if (isPublicPath(pathname) && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/calls/:path*",
    "/live/:path*",
    "/team/:path*",
    "/settings/:path*",
  ],
};




