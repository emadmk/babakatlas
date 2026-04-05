import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Admin user
        if (
          credentials?.email === "admin@atlasadaptive.com" &&
          credentials?.password === "Atlas2026!"
        ) {
          return {
            id: "admin-1",
            name: "Admin",
            email: "admin@atlasadaptive.com",
            role: "admin",
          };
        }
        // Demo user
        if (
          credentials?.email === "demo@atlasadaptive.com" &&
          credentials?.password === "demo1234"
        ) {
          return {
            id: "user-1",
            name: "Demo User",
            email: "demo@atlasadaptive.com",
            role: "user",
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role;
        (session.user as { role?: string; id?: string }).id = token.id;
      }
      return session;
    },
  },
};
