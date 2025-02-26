import { NextResponse } from "next/server";
import AdminApiServices from "./services/api/Admin.api.services";

export async function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const currentPath = request.nextUrl.pathname;
  if (!token && currentPath !== "/login")
    return NextResponse.redirect(new URL("/login", request.url));

  try {
    const data = await AdminApiServices.getMyProfile(token);

    if (data.success && currentPath === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!data.success && currentPath !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication failed:", error.message);
    if (currentPath !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/states",
    "/state/:path*",
    "/cities",
    "/city/:path*",
    "/locations",
    "/location/:path*",
    "/login",
    "/leads",
  ],
};
