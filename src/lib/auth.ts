import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDb } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Domain restriction — safety net on top of Google Workspace "Internal" setting
      const email = user.email;
      if (!email?.endsWith("@wearesauce.io")) {
        return false;
      }

      // Upsert user in database
      const db = getDb();
      const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;

      if (!existing) {
        const now = new Date().toISOString();
        db.prepare("INSERT INTO users (email, name, avatar_url, created_at) VALUES (?, ?, ?, ?)").run(
          email,
          user.name || email.split("@")[0],
          user.image || null,
          now
        );
      } else if (user.image) {
        // Update avatar on each sign-in in case it changed
        db.prepare("UPDATE users SET avatar_url = ? WHERE email = ?").run(user.image, email);
      }

      return true;
    },
    async session({ session }) {
      // Enrich session with user ID from our database
      if (session.user?.email) {
        const db = getDb();
        const row = db.prepare("SELECT id, name, avatar_url FROM users WHERE email = ?").get(session.user.email) as {
          id: number;
          name: string;
          avatar_url: string | null;
        } | undefined;

        if (row) {
          (session.user as unknown as Record<string, unknown>).dbId = row.id;
          session.user.name = row.name;
          if (row.avatar_url) session.user.image = row.avatar_url;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
