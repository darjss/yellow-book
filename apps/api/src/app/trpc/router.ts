import { initTRPC } from '@trpc/server';
import { z } from 'zod';
type User = {
  id: string;
  name: string;
  bio?: string;
};
const users: Record<string, User> = {
    "1": {
        id: "1",
        name: "John Doe",
        bio: "I am a software engineer",
    },
    "2": {
        id: "2",
        name: "Jane Doe",
        bio: "I am a software engineer",
    },
    "3": {
        id: "3",
        name: "John Doe",
        bio: "I am a software engineer",
    },
};
export const t = initTRPC.create();
export const appRouter = t.router({
  getUserById: t.procedure.input(z.string()).query((opts) => {
    console.log(opts.input);
    console.log(users[opts.input]);
    console.log(opts.input);
    return users[opts.input];
  }),
  createUser: t.procedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation((opts) => {
      const id = Date.now().toString();
      const user: User = { id, ...opts.input };
      users[user.id] = user;
      return user;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;