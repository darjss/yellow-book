import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { TRPCError } from '@trpc/server';

export const t = initTRPC.create();
export const appRouter = t.router({
  getAllBusinesses: t.procedure.input(z.object({
    search: z.string().optional(),
    categoryId: z.string().optional(),
  })).query(async ({input}) => {
    const businesses = await prisma.business.findMany({
      where:{
        ...(input.search && {
          name: {
            contains: input.search,
            mode: 'insensitive',
          },
          include: {
            category: {
              select: { name: true }
            }
          }
        }),
        ...(input.categoryId!=='All' && {
          categoryId: input.categoryId,
        }),
      },
      include: {
        category: {
          select: { name: true }
        }
      }
    });

    return businesses;
  }),
  getAllCategories: t.procedure.query(async (opts) => {
    const categories = await prisma.category.findMany();
    return categories;
  }),
  getBusinessById: t.procedure.input(z.object({
    id: z.string(),
  })).query(async ({input}) => {
    const business = await prisma.business.findUnique({
      where: { id: input.id },
      include: {
        category: {
          select: { name: true }
        }
      }
    });
    if (!business) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Business not found' });
    }

    return business ;
  }),
});

export type AppRouter = typeof appRouter;