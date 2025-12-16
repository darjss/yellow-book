import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

// Session type from the web app
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

export function createContext({ req, res }: CreateFastifyContextOptions) {
  // Extract session from x-session header (sent from web app)
  let session: Session | null = null;

  const sessionHeader = req.headers['x-session'];
  if (sessionHeader && typeof sessionHeader === 'string') {
    try {
      session = JSON.parse(sessionHeader);
    } catch {
      session = null;
    }
  }

  return { req, res, session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
