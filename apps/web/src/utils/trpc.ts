import { QueryCache, QueryClient, isServer } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
/* eslint-disable-next-line */
import type { AppRouter } from "../../../api/src/app/trpc/router";
import { toast } from "sonner";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(error.message, {
				action: {
					label: "retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window !== 'undefined') return '';
    // SSR: use internal Docker service name by default; override with env if set
    return process.env.INTERNAL_BACKEND_URL || 'http://api:3001';
}

const trpcClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `${getBaseUrl()}/trpc`,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
        }),
    ],
});

export const trpc: TRPCOptionsProxy<AppRouter> = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient:getQueryClient(),
});
