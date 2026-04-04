import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // TODO: Replace with actual database lookup
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // });
        // if (!user || !user.password) {
        //   throw new Error("Invalid credentials");
        // }
        // const isValid = await bcrypt.compare(credentials.password, user.password);
        // if (!isValid) {
        //   throw new Error("Invalid credentials");
        // }

        // Demo user for development
        if (
          credentials.email === "demo@babakatlas.com" &&
          credentials.password === "demo1234"
        ) {
          return {
            id: "1",
            name: "Atlas User",
            email: "demo@babakatlas.com",
            image: null,
          };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
