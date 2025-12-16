import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';

// Edge-compatible auth configuration (no database adapter)
// This is used by middleware which runs on the Edge runtime
// Note: Middleware can only check if user is logged in, not their role
// Role checks happen in the full auth.ts which has database access
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (!isLoggedIn) return false; // Redirect to login page
        // Note: Role check is done in page/layout since middleware can't access DB
        return true;
      }

      return true;
    },
  },
};
