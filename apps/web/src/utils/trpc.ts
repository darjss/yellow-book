import { QueryCache, QueryClient, isServer } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { toast } from 'sonner';
/* eslint-disable-next-line */
import type { AppRouter } from '../../../api/src/app/trpc/router';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser: use public URL or relative path
    return process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }
  // Server: use internal Docker service name
  return process.env.INTERNAL_BACKEND_URL || 'http://api:3001';
}

// Helper to get session from the auth endpoint (client-side only)
async function getSessionHeader(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const res = await fetch('/api/auth/session');
    if (res.ok) {
      const session = await res.json();
      if (session?.user) {
        return { 'x-session': JSON.stringify(session) };
      }
    }
  } catch {
    // Session fetch failed, continue without auth
  }
  return {};
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      async headers() {
        // Add session header for authenticated requests
        return getSessionHeader();
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

export const trpc: TRPCOptionsProxy<AppRouter> =
  createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient: getQueryClient(),
  });

// Export the raw tRPC client for mutations
export const trpcMutationClient = trpcClient;

export function createServerApi(revalidate?: number | false) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            next: {
              revalidate: revalidate ?? 60,
            },
          });
        },
      }),
    ],
  });
}

// Default server API with 60 second revalidation for ISR
export const serverApi = createServerApi(60);
