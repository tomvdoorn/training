import { createTRPCRouter as router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { db as prisma } from '../../db';


export const userRouter = router({
  updateDetails: protectedProcedure

    .input(z.object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional()
    }))
    .mutation(async ({ input }) => {
      const updatedUser = await prisma.user.update({
        where: { id: input.id },
        data: input
      });
      return updatedUser
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({ where: { id: input.id } });
    }),

  isFollowing: publicProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.follow.findFirst({
        where: { 
          followerId: input.followerId, 
          followingId: input.followingId 
        }
      }).then(follow => !!follow);
    }),

  getFollowersCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.follow.count({ where: { followingId: input.userId } });
    }),

  getFollowingCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.follow.count({ where: { followerId: input.userId } });
    }),

  getCurrentUser: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findUnique({ where: { id: ctx.session.user.id } });
    }),

  followUser: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.follow.create({
        data: {
          followerId: ctx.session.user.id,
          followingId: input.followingId,
        },
      });
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: input.followingId,
          },
        },
      });
    }),

  updateBio: protectedProcedure
    .input(z.object({
      bio: z.string().max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { bio: input.bio },
      });
      return updatedUser;
    }),
});
