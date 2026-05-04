import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        await connectDB();
        const userDoc = await User.findOne({ email: email.toLowerCase().trim() }).lean();
        if (!userDoc?.passwordHash) return null;
        const valid = await bcrypt.compare(password, userDoc.passwordHash);
        if (!valid) return null;
        const u = userDoc as { _id: unknown; email: string; name: string; role?: string };
        const role = u.role === "admin" ? "admin" : "user";
        return {
          id: String(userDoc._id),
          email: userDoc.email,
          name: userDoc.name,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role =
          "role" in user && (user as { role?: string }).role === "admin"
            ? "admin"
            : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
  },
});
