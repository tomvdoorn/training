import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { getDayPart } from "~/utils/dateHelpers";




export const postRouter = createTRPCRouter({

  createPost: protectedProcedure
    .input(z.object({
      trainingSessionId: z.number(),
      templateId: z.number().optional(),
      privacy: z.enum(['public', 'friends', 'private']),
      note: z.string().optional(),
      title: z.string(),
      mediaIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const trainingSession = await ctx.db.trainingSession.findUnique({
        where: { id: input.trainingSessionId },
        include: { template: true },
      });

      if (!trainingSession) {
        throw new Error("Training session not found");
      }

      const dayPart = getDayPart(trainingSession.startTime);
      const defaultTitle = `${trainingSession.template?.name ?? 'Workout'} - ${dayPart}`;

      const post = await ctx.db.post.create({
        data: {
          userId: ctx.session.user.id,
          trainingSessionId: input.trainingSessionId,
          templateId: input.templateId,
          title: input.title || defaultTitle,
          note: input.note,
          privacy: input.privacy,
        },
      });

      if (input.mediaIds?.length) {
        await ctx.db.media.updateMany({
          where: {
            id: {
              in: input.mediaIds.map(id => parseInt(id)),
            },
          },
          data: { postId: post.id },
        });
      }

      return post;
    }),
  
  updatePost: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      note: z.string().optional(),
      privacy: z.enum(['public', 'friends', 'private']).optional(),
      numberOfPRs: z.number().optional(),
      totalWeightLifted: z.number().optional(),
      mediaIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, mediaIds, ...updateData } = input;

      const post = await ctx.db.post.update({
        where: { id },
        data: updateData,
      });

      if (mediaIds !== undefined) {
        await ctx.db.media.updateMany({
          where: { postId: id },
          data: { postId: null },
        });

        if (mediaIds.length > 0) {
          await ctx.db.media.updateMany({
            where: {
              id: {
                in: mediaIds.map(mid => parseInt(mid)),
              },
            },
            data: { postId: post.id },
          });
        }
      }

      return post;
    }),

  deletePost: protectedProcedure
    .input(z.object({ trainingSessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({ where: { trainingSessionId: input.trainingSessionId } });
    }),

  getAllPosts: publicProcedure
    .input(z.object({
        userId: z.string().optional(),
        profileUserId: z.string().optional(),
    }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          OR: [
            {
              AND: [
                { privacy: 'public' },
                input?.profileUserId ? { userId: input.profileUserId } : {},
              ]
            },
            input?.userId ? { userId: input.userId } : {},
          ],
        },
        include: {
          user: true,
          likes: true,
          comments: {
            include: {
              user: true,
              likes: true,
            },
          },
          trainingSession: {
            include: {
              template: true,
              exercises: {
                include: {
                  exercise: true,
                  sets: {
                    include: {
                      personalRecords: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.db.postLike.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });

      if (existingLike) {
        await ctx.db.postLike.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        await ctx.db.postLike.create({
          data: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        });
        return { liked: true };
      }
    }),

  addComment: protectedProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const newComment = await ctx.db.postComment.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
          content: input.content,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            }
          }
        }
      });
      return newComment;
    }),

  toggleCommentLike: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.db.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: ctx.session.user.id,
            commentId: input.commentId,
          },
        },
      });

      if (existingLike) {
        await ctx.db.commentLike.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        await ctx.db.commentLike.create({
          data: {
            userId: ctx.session.user.id,
            commentId: input.commentId,
          },
        });
        return { liked: true };
      }
    }),

});
