import { createTRPCRouter as router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db as prisma } from '../../db';
import { SetType } from '@prisma/client';

export const setRouter = router({
  // Add set to template exercise
  addSetToTemplateExercise: publicProcedure
    .input(z.object({
      templateExerciseId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const set = await prisma.templateExerciseSet.create({
        data: {
          templateExerciseId: input.templateExerciseId,
          reps: 0, // default values
          weight: 0,
          duration: 0,
          distance: 0,
          type: 'Regular',
        },
      });
      return set;
    }),

  // Adjust values of set
  updateSet: publicProcedure
    .input(z.object({
      setId: z.number(),
      reps: z.number().optional(),
      weight: z.number().optional(),
      duration: z.number().optional(),
      distance: z.number().optional(),
      type: z.nativeEnum(SetType),
      rpe: z.number().optional(),
      video: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const set = await prisma.templateExerciseSet.update({
        where: { id: input.setId },
        data: {
          reps: input.reps,
          weight: input.weight,
          duration: input.duration,
          distance: input.distance,
          type: input.type,
          rpe: input.rpe,
          video: input.video,
        },
      });
      return set;
    }),

  // Delete set
  deleteSet: publicProcedure
    .input(z.object({
      setId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await prisma.templateExerciseSet.delete({
        where: { id: input.setId },
      });
      return { success: true };
    }),
});
