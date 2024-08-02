import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { db as prisma } from '../../db';

export const sessionRouter = createTRPCRouter({
  scheduleSession: protectedProcedure
    .input(z.object({
      templateId: z.number(),
      date: z.date(),
    }))
    .mutation(async ({ input,ctx }) => {
      const { session } = ctx
      const newSession = await prisma.trainingSession.create({
        data: {
          userId: session.user.id,
          templateId: input.templateId,
          startTime: input.date,
          endTime: new Date(input.date.getTime() + 60 * 60 * 1000), // Default to 1 hour duration
        },
      })

      return newSession
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const { session } = ctx

      const trainingSessions = await prisma.trainingSession.findMany({
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
})