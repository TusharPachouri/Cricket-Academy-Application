import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Middleware uses ONLY the edge-compatible config — no MongoDB, no Node.js modules
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
