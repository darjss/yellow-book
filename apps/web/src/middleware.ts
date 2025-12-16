import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Protect /dashboard routes
  matcher: ['/dashboard/:path*'],
};
