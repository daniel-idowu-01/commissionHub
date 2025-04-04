import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const user = await verifyToken(token);
    req.headers.set("x-user", JSON.stringify(user));
    return NextResponse.next();
  } catch (error: any) {
    console.error(error.message || error)
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

// Apply middleware only to protected routes
export const config = {
  runtime: "nodejs",
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/settings/:path*",
    "/api/protected/:path*",
  ],
};
