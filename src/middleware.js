import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Homepage redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/states" : "/login", request.url),
    );
  }

  // Login is public
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Protect all remaining pages
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
