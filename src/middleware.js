import axios from "axios";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  try {
    const { data } = await axios.get("http://localhost:4000/api/v1/me", {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });

    if (!data.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication failed:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/states",
    "/state/:path*",
    "/settings",
    "/cities",
    "/city/:path*",
    "/locations",
    "/location/:path*",
  ],
};
