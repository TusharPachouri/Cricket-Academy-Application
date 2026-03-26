import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongoClient";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  // MongoDB adapter — stores sessions & OAuth accounts
  adapter: MongoDBAdapter(clientPromise, { databaseName: "braj_cricket_academy" }),

  session: { strategy: "jwt" },

  // Override providers with full logic (Node.js runtime — safe to use bcrypt + mongoose here)
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes("your-google")
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          profile(profile) {
            return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture, role: "user" };
          },
        })]
      : []
    ),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // Admin — hardcoded from env, no DB needed
        if (
          email === process.env.ADMIN_EMAIL?.toLowerCase() &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Admin", email, role: "admin" };
        }

        // Regular user — check DB
        await connectDB();
        const user = await User.findOne({ email, isActive: true });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profilePhoto,
        };
      },
    }),
  ],
});

// Extend NextAuth types
declare module "next-auth" {
  interface User { role?: string; }
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
