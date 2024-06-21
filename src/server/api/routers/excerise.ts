import { createTRPCRouter as router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db as prisma } from '../../db';

export const exerciseRouter = router({
  // Get a list of exercises
  getExercises: publicProcedure.query(async () => {
    const exercises = await prisma.exercise.findMany();
    return exercises;
  }),

  // Add a new exercise
  addExercise: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      muscleGroup: z.string(),
      type: z.string(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      userId: z.string().optional(),  // Ensure this is tied to the user
    }))
    .mutation(async ({ input }) => {
      const exercise = await prisma.exercise.create({
        data: {
          name: input.name,
          description: input.description,
          muscleGroup: input.muscleGroup,
          type: input.type,
          imageUrl: input.imageUrl,
          videoUrl: input.videoUrl,
          userId: input.userId,
        },
      });
      return exercise;
    }),

  // Delete exercise if tied to user
  deleteUserExercise: publicProcedure
    .input(z.object({
      exerciseId: z.number(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const exercise = await prisma.exercise.findFirst({
        where: {
          id: input.exerciseId,
          userId: input.userId,
        },
      });

      if (!exercise) {
        throw new Error("Exercise not found or you don't have permission to delete this exercise.");
      }

      await prisma.exercise.delete({
        where: { id: input.exerciseId },
      });

      return { success: true };
    }),
});
