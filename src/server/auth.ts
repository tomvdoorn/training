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
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      emailVerified: Date | null;
    } & DefaultSession["user"];
    supabaseAccessToken?: string;
  }

  interface User {
    firstName: string | null;
    lastName: string | null;
    emailVerified: Date | null;
  }

  interface JWT {
    supabaseAccessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in', // Redirect errors back to sign-in page
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.emailVerified = user.emailVerified;
        token.supabaseAccessToken = jwt.sign(
          { 
            sub: user.id,
            role: 'authenticated',
            aud: 'authenticated',
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour from now
            iat: Math.floor(Date.now() / 1000),
            app_metadata: {
              provider: 'credentials',
              provider_id: user.id,
            },
          },
          process.env.SUPABASE_JWT_SECRET ?? '', // Use JWT secret instead of service role key
          { algorithm: 'HS256' }
        );
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        firstName: token.firstName as string | null,
        lastName: token.lastName as string | null,
        emailVerified: token.emailVerified as Date | null,
      },
      supabaseAccessToken: token.supabaseAccessToken,
    }),
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
            throw new Error("Please enter your email and password");
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user?.password) {
            throw new Error("No account found with this email");
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email before signing in");
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified,
            image: null 
          };
        } catch (error) {
          // Throw the error message to display it to the user
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An unexpected error occurred");
        }
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);