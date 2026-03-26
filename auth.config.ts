import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge-compatible auth config — NO Node.js modules (no mongodb, no bcrypt).
 * Used by middleware.ts which runs in the Edge runtime.
 * The full auth.ts extends this with the MongoDB adapter + real DB logic.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Only include Google if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes("your-google")
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []
    ),
    // Credentials provider must be listed here for middleware to recognise it,
    // but the actual authorize() logic lives in auth.ts (Node.js runtime only).
    Credentials({}),
  ],
  callbacks: {
    // Route protection happens here — runs on every matched middleware request
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const role = (auth?.user as { role?: string })?.role;

      if (pathname.startsWith("/dashboard")) {
        return role === "admin";
      }
      if (pathname.startsWith("/profile")) {
        return !!auth;
      }
      // Redirect logged-in users away from login/register
      if (pathname === "/login" || pathname === "/register") {
        if (auth) return Response.redirect(
          new URL(role === "admin" ? "/dashboard" : "/profile", request.url)
        );
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
