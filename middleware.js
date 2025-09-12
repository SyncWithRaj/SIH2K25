import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Config
export const config = {
  matcher: [
    // Run auth on all routes EXCEPT homepage
    "/((?!_next|.*\\..*|api/public|$).*)",
    "/(api|trpc)(.*)",
  ],
};
