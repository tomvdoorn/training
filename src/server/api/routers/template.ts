import { createTRPCRouter as router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db as prisma } from '../../db';

export const templateRouter = router({
  // Create an empty template
  createTemplate: publicProcedure
    .input(z.object({
      name: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const template = await prisma.template.create({
        data: {
          name: input.name,
          userId: input.userId,
        },
      });
      return template;
    }),

  // Add exercise to template
  addExerciseToTemplate: publicProcedure
    .input(z.object({
      templateId: z.number(),
      exerciseId: z.number(),
      order: z.number(),
    }))
    .mutation(async ({ input }) => {
      const templateExercise = await prisma.templateExercise.create({
        data: {
          templateId: input.templateId,
          exerciseId: input.exerciseId,
          order: input.order,
        },
      });
      return templateExercise;
    }),

  // Delete template
  deleteTemplate: publicProcedure
    .input(z.object({
      templateId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await prisma.template.delete({
        where: { id: input.templateId },
      });
      return { success: true };
    }),
});
