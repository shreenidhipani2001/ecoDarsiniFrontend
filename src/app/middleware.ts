// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");

  const protectedRoutes = ["/dashboard", "/admin"];

  if (
    protectedRoutes.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    ) &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
