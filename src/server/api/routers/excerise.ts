import { createTRPCRouter as router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db as prisma } from '../../db';
import { MuscleGroup } from '@prisma/client';

export const exerciseRouter = router({
  // Get a list of exercises
  getExercises: publicProcedure
  .query(async () => {
    const exercises = await prisma.exercise.findMany();
    return exercises;
  }),

  getExerciseCategories: publicProcedure
  .query(async () => {
    const categories = await prisma.exerciseCategory.findMany(
    );
    return categories;
  }),

  // Add a new exercise
  addExercise: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      muscleGroup: z.nativeEnum(MuscleGroup).optional(),
      categoryId: z.number(),
      type: z.string(),
      image: z.string().optional(),
      video: z.string().optional(),
      userId: z.string().optional(),  // Ensure this is tied to the user
    }))
    .mutation(async ({ input }) => {
      const exercise = await prisma.exercise.create({
        data: {
          name: input.name,
          description: input.description,
          muscleGroup: input.muscleGroup,
          categoryId: input.categoryId,
          type: input.type,
          image: input.image,
          video: input.video,
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
