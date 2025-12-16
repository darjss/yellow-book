import { TRPCError, initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';
import prisma from '../lib/prisma';

// Validation schema for business form
export const businessFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be 1000 characters or less'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address must be 200 characters or less'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      'Invalid phone number format'
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  website: z.string().min(1, 'Website is required').url('Invalid URL format'),
  googleMapUrl: z
    .string()
    .min(1, 'Google Map URL is required')
    .url('Invalid URL format'),
  facebookUrl: z
    .string()
    .min(1, 'Facebook URL is required')
    .url('Invalid URL format'),
  instagramUrl: z
    .string()
    .min(1, 'Instagram URL is required')
    .url('Invalid URL format'),
  timetable: z
    .string()
    .min(1, 'Timetable is required')
    .max(500, 'Timetable must be 500 characters or less'),
  categoryId: z.string().min(1, 'Category is required'),
});

export type BusinessFormData = z.infer<typeof businessFormSchema>;

// Initialize tRPC with context
export const t = initTRPC.context<Context>().create();

// Public procedure - no auth required
const publicProcedure = t.procedure;

// Admin procedure - requires admin role
const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || ctx.session.user?.role !== 'admin') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be an admin to perform this action',
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session, // Now we know session is defined
    },
  });
});

export const appRouter = t.router({
  // Public routes
  getAllBusinesses: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const businesses = await prisma.business.findMany({
        where: {
          ...(input.search && {
            name: {
              contains: input.search,
              mode: 'insensitive',
            },
          }),
          ...(input.categoryId !== 'All' && {
            categoryId: input.categoryId,
          }),
        },
        include: {
          category: {
            select: { name: true },
          },
        },
      });

      return businesses;
    }),

  getAllCategories: publicProcedure.query(async () => {
    const categories = await prisma.category.findMany();
    return categories;
  }),

  getBusinessById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const business = await prisma.business.findUnique({
        where: { id: input.id },
        include: {
          category: {
            select: { name: true },
          },
        },
      });
      if (!business) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Business not found',
        });
      }

      return business;
    }),

  // Admin-protected routes
  createBusiness: adminProcedure
    .input(businessFormSchema)
    .mutation(async ({ input }) => {
      const existingBusiness = await prisma.business.findUnique({
        where: { email: input.email },
      });

      if (existingBusiness) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A business with this email already exists',
        });
      }

      const business = await prisma.business.create({
        data: input,
        include: {
          category: {
            select: { name: true },
          },
        },
      });

      return business;
    }),

  updateBusiness: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: businessFormSchema,
      })
    )
    .mutation(async ({ input }) => {
      const existingBusiness = await prisma.business.findUnique({
        where: { id: input.id },
      });

      if (!existingBusiness) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Business not found',
        });
      }

      // Check if email is being changed and if it conflicts with another business
      if (input.data.email !== existingBusiness.email) {
        const emailConflict = await prisma.business.findUnique({
          where: { email: input.data.email },
        });

        if (emailConflict) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A business with this email already exists',
          });
        }
      }

      const business = await prisma.business.update({
        where: { id: input.id },
        data: input.data,
        include: {
          category: {
            select: { name: true },
          },
        },
      });

      return business;
    }),

  deleteBusiness: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existingBusiness = await prisma.business.findUnique({
        where: { id: input.id },
      });

      if (!existingBusiness) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Business not found',
        });
      }

      await prisma.business.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
