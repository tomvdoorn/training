import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    firstName: string | null;
    lastName: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in', // Redirect errors back to sign-in page
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          firstName: token.firstName as string | null,
          lastName: token.lastName as string | null,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null; // Return null instead of throwing an error
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user?.password) {
            return null; // Return null instead of throwing an error
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null; // Return null instead of throwing an error
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: null 
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null; // Return null for any unexpected errors
        }
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);