import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@yellow-book/db';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Use database sessions instead of JWT
  session: { strategy: 'database' },
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
    // Add role to session from database user
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        session.user.role = dbUser?.role ?? 'user';
      }
      return session;
    },
  },
});
