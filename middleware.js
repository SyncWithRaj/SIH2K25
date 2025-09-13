// middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();

  // Extract role if needed (from Clerk metadata)
  const role =
    sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;

  const url = req.nextUrl.clone();

  if (url.pathname === "/") return NextResponse.next();

  // if (url.pathname.startsWith("/admin-dashboard")) {
  //   if (!userId || role !== "admin") {
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/|.*\\..+$|api/).*)",
  ],
};
