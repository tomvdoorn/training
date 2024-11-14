import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const sessionRouter = createTRPCRouter({
  scheduleSession: protectedProcedure
    .input(z.object({
      templateId: z.number(),
      date: z.date(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx
      const newSession = await ctx.db.trainingSession.create({
        data: {
          userId: session.user.id,
          templateId: input.templateId,
          startTime: input.date,
          endTime: new Date(input.date.getTime() + 60 * 60 * 1000),
        },
      })
      return newSession
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const { session } = ctx
      const trainingSessions = await ctx.db.trainingSession.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          template: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      })
      return trainingSessions
    }),

  createTrainingSession: protectedProcedure
    .input(z.object({
      templateId: z.number(),
      startTime: z.date(),
      endTime: z.date(),
      completed: z.boolean().optional(),
      rating: z.number().min(1).max(10).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.trainingSession.create({
        data: {
          templateId: input.templateId,
          userId: ctx.session.user.id,
          startTime: input.startTime,
          endTime: input.endTime,
          completed: input.completed,
          rating: input.rating,
        },
      });
    }),

  updateTrainingSession: protectedProcedure
    .input(z.object({ id: z.number(), startTime: z.date(), endTime: z.date() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.trainingSession.update({ where: { id: input.id }, data: input });
    }),

  createSessionExercise: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      exerciseId: z.number(),
      order: z.number(),
      templateExerciseId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.sessionExercise.create({
        data: {
          sessionId: input.sessionId,
          exerciseId: input.exerciseId,
          order: input.order,
          templateExerciseId: input.templateExerciseId,
        },
      });
    }),

  updateSessionExercise: protectedProcedure
    .input(z.object({ id: z.number(), order: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.sessionExercise.update({
        where: { id: input.id },
        data: { order: input.order },
      });
    }),

  createSessionSet: protectedProcedure
    .input(z.object({
      sessionExerciseId: z.number(),
      reps: z.number(),
      weight: z.number().optional(),
      type: z.enum(['Warmup', 'Regular', 'Dropset', 'Superset', 'Partials']),
      completed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.sessionExerciseSet.create({
        data: {
          sessionExerciseId: input.sessionExerciseId,
          reps: input.reps,
          weight: input.weight,
          type: input.type,
          completed: input.completed,
        },
      });
    }),

  updateSessionSet: protectedProcedure
    .input(z.object({
      id: z.number(),
      reps: z.number(),
      weight: z.number(),
      type: z.enum(['Warmup', 'Regular', 'Dropset', 'Superset', 'Partials']),
      completed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.sessionExerciseSet.update({
        where: { id },
        data,
      });
    }),

  deleteSession: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.media.deleteMany({
        where: {
          OR: [
            { trainingSessionId: input.id },
            { sessionExercise: { sessionId: input.id } }
          ]
        }
      });

      await ctx.db.sessionExerciseSet.deleteMany({ 
        where: { sessionExercise: { sessionId: input.id } } 
      });
      await ctx.db.sessionExercise.deleteMany({ 
        where: { sessionId: input.id } 
      });
      return ctx.db.trainingSession.delete({ 
        where: { id: input.id } 
      });
    }),

  getLastSessionData: protectedProcedure
    .input(z.object({
      templateId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const lastSession = await ctx.db.trainingSession.findFirst({
        where: { 
          templateId: input.templateId,
          userId: ctx.session.user.id,
          completed: true
        },
        orderBy: { startTime: 'desc' },
        include: {
          exercises: {
            include: {
              sets: true,
            },
          },
        },
      });
      return lastSession;
    }),

  getPRSessionData: protectedProcedure
    .input(z.object({
      templateId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const prSessions = await ctx.db.exercisePersonalRecord.findMany({
        where: {
          userId: ctx.session.user.id,
          sessionExercise: {
            session: {
              templateId: input.templateId,
            },
          },
        },
        include: {
          sessionExercise: {
            include: {
              sets: true,
            },
          },
        },
        orderBy: {
          value: 'desc',
        },
        distinct: ['exerciseId'],
      });

      return prSessions.reduce<Record<number, typeof prSessions[number]['sessionExercise']>>((acc, pr) => {
        acc[pr.exerciseId] = pr.sessionExercise;
        return acc;
      }, {});
    }),
})
