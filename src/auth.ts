import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/generated/prisma/client";

import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email
          .trim()
          .toLowerCase();

        const password = credentials.password;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          console.log("AUTH: user not found");
          return null;
        }

        if (user.status !== "ACTIVE") {
          console.log("AUTH: user inactive");
          return null;
        }

        const passwordValid = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!passwordValid) {
          console.log("AUTH: invalid password");
          return null;
        }

        console.log(
          `AUTH: login successful - ${user.email} (${user.role})`,
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.schoolId = user.schoolId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.schoolId =
          (token.schoolId as string | null) ?? null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});