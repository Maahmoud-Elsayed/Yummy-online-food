import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import {
  type DefaultUser,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";

import {
  type Role,
  loginUserServerSchema,
} from "@/lib/validations-schema/user-schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string | undefined;
      role: Role;
      status: "ACTIVE" | "SUSPENDED";
    } & DefaultSession["user"];
    provider?: string;
  }

  interface User extends DefaultUser {
    role: Role;
    status: "ACTIVE" | "SUSPENDED";
  }
}
declare module "next-auth/adapters" {
  interface AdapterUser {
    password?: string;
    role: Role;
    status: "ACTIVE" | "SUSPENDED";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    role: Role;
    status: "ACTIVE" | "SUSPENDED";
    // suspendStatus?: {
    //   suspendedAt?: Date;
    //   suspendExpiresAt?: Date;
    // };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const validEmail = loginUserServerSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
        if (!credentials?.password || !validEmail.success) {
          throw new Error("Invalid email or password");
        }
        const user = await authAdapter.getUserByEmail!(validEmail.data.email);
        if (!user) {
          throw new Error("Invalid email or password");
        }
        if (!user.password) {
          throw new Error("Invalid email or password");
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }
        if (user.status === "SUSPENDED") {
          throw new Error("Account suspended");
        }
        return user;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    async jwt({ token, trigger, session, account, user, profile }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
      }
      if (account) {
        token.provider = account.provider;
      }
      if (trigger === "update") {
        token.email = session.user.email;
        token.name = session.user.name;
        token.picture = session.user.image;
        token.provider = session.provider;
        token.role = session.user.role;
        token.status = session.user.status;
      }
      return token;
    },
    async session({ session, token, trigger }) {
      if (token || trigger === "update") {
        const { name, email, picture, sub, role, provider, status } = token;
        session = {
          ...session,
          user: {
            ...session.user,
            id: sub,
            name,
            email,
            image: picture,
            role,
            status,
          },
          provider: provider,
        };
      }
      return session;
    },
    async signIn({ user }) {
      if (user) {
        if (user.status === "SUSPENDED") {
          return "/suspended?u=" + user.id;
        }
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const authAdapter = authOptions.adapter!;
export const getServerAuthSession = () => getServerSession(authOptions);
