import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@yellow-book/db';
import NextAuth, { type NextAuthResult } from 'next-auth';
import GitHub from 'next-auth/providers/github';

const nextAuth: NextAuthResult = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Use JWT sessions for Edge runtime compatibility
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      // Allow linking OAuth accounts to existing users with the same email
      // This is needed because we pre-create admin users in the seed script
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    // Store user id and role in JWT token
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // Fetch role from database on sign in
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role ?? 'user';
      }
      // Refresh role on update trigger
      if (trigger === 'update' && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        token.role = dbUser?.role ?? 'user';
      }
      return token;
    },
    // Add user id and role to session from JWT
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? 'user';
      }
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;
