import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getAdminUserByEmail } from "@/lib/adminData";

// Only add Google provider if credentials are configured
const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

providers.push(
  CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Admin user (hardcoded for security)
        if (
          credentials.email === "admin@atlasadaptive.com" &&
          credentials.password === "Atlas2026!"
        ) {
          return {
            id: "admin-1",
            name: "Admin",
            email: "admin@atlasadaptive.com",
            role: "admin",
          };
        }

        // Check registered users from data store
        const user = getAdminUserByEmail(credentials.email);
        if (user && user.status === "active") {
          // Check password (plain comparison for now - use bcrypt in production)
          if (user.password === credentials.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: "user",
            };
          }
        }

        return null;
      },
    })
);

export const authOptions: NextAuthOptions = {
  providers,
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
