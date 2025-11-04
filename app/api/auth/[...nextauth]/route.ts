import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config, isCloudMode } from "@/lib/config";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In demo/offline mode, accept any credentials
        if (!isCloudMode()) {
          return {
            id: "user-1",
            name: "Alex Student",
            email: credentials?.email || "alex@university.edu",
          };
        }

        // In cloud mode, verify against Supabase
        // TODO: Implement proper authentication with Supabase Auth
        // For now, use the same demo behavior
        return {
          id: "user-1",
          name: "Alex Student",
          email: credentials?.email || "alex@university.edu",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: config.auth.secret,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

