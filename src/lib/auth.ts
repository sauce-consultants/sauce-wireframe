import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { initDb } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email?.endsWith("@wearesauce.io")) {
        return false;
      }

      const db = await initDb();
      const result = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
      const existing = result.rows[0];

      if (!existing) {
        const now = new Date().toISOString();
        await db.execute({
          sql: "INSERT INTO users (email, name, avatar_url, created_at) VALUES (?, ?, ?, ?)",
          args: [email, user.name || email.split("@")[0], user.image || null, now],
        });
      } else if (user.image) {
        await db.execute({ sql: "UPDATE users SET avatar_url = ? WHERE email = ?", args: [user.image, email] });
      }

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const db = await initDb();
        const result = await db.execute({ sql: "SELECT id, name, avatar_url FROM users WHERE email = ?", args: [session.user.email] });
        const row = result.rows[0] as unknown as { id: number; name: string; avatar_url: string | null } | undefined;

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
