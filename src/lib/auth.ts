import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";
import { logInSchema } from "./zod";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {

        const parsedCredentials = logInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error("Invalid credentials :", parsedCredentials.error.message);
          return null;  
        }

        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user || !user.password) {
          console.error(
            "Invalid email or password: User not found or password missing."
          );
          throw new Error("Invalid email or password");
        }

        try {
          const isValid = await bcrypt.compare(
            String(credentials.password),
            user.password
          );

          if (!isValid) {
            console.error("Invalid email or password: Mismatch.");
            throw new Error("Invalid email or password");
          }
          return { id: user.id, email: user.email, name: user.name };
        } catch (bcryptError) {
          console.error("Bcrypt comparison error:", bcryptError);
          throw new Error("Authentication failed due to a server error.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async authorized({ request: { nextUrl }, auth }) {
    const isLoggedIn = !!auth?.user;
    const { pathname } = nextUrl;

    // Redirect logged-in users away from auth pages
    if ((pathname.startsWith("/login") || pathname.startsWith("/register")) && isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }

    // Allow access to all routes if logged in
    if (isLoggedIn) return true;

    // Redirect unauthenticated users to login
    if (!isLoggedIn && !pathname.startsWith("/login") && !pathname.startsWith("/register") && pathname !== "/") {
      return Response.redirect(new URL("/login", nextUrl));
    }
    
    return true;
  },

  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },
    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: true,
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);
