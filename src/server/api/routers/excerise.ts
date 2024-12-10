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
      type: z.number(),
      image: z.string().optional(),
      video: z.string().optional(),
      userId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const exercise = await prisma.exercise.create({
        data: {
          name: input.name,
          description: input.description,
          muscleGroup: input.muscleGroup,
          categoryId: input.categoryId,
          typeId: input.type,
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

  createPersonalRecord: publicProcedure
    .input(z.object({
      exerciseId: z.number(),
      userId: z.string(),
      sessionExerciseId: z.number(),
      setId: z.number(),
      prType: z.enum(['HighestWeight', 'HighestVolume', 'HighestOneRepMax']),
      value: z.number(),
    }))
    .mutation(async ({ input }) => {
      const pr = await prisma.exercisePersonalRecord.create({
        data: input,
      });
      return pr;
    }),

  getPersonalRecord: publicProcedure
    .input(z.object({
      exerciseId: z.number(),
      userId: z.string(),
      prType: z.enum(['HighestWeight', 'HighestVolume', 'HighestOneRepMax']),
    }))
    .query(async ({ input }) => {
      const pr = await prisma.exercisePersonalRecord.findFirst({
        where: {
          exerciseId: input.exerciseId,
          userId: input.userId,
          prType: input.prType,
        },
        orderBy: {
          value: 'desc',
        },
      });
      return pr;
    }),

  checkAndCreatePR: publicProcedure
    .input(z.object({
      exerciseId: z.number(),
      sessionExerciseId: z.number(),
      setId: z.number(),
      reps: z.number(),
      weight: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      let newPRsCount = 0;
      const prTypes = ['HighestWeight', 'HighestVolume', 'HighestOneRepMax'] as const;

      for (const prType of prTypes) {
        let value: number;
        switch (prType) {
          case 'HighestWeight':
            value = input.weight;
            break;
          case 'HighestVolume':
            value = input.reps * input.weight;
            break;
          case 'HighestOneRepMax':
            value = input.weight * (1 + input.reps / 30);
            break;
        }

        const existingPR = await ctx.db.exercisePersonalRecord.findFirst({
          where: {
            exerciseId: input.exerciseId,
            userId: userId,
            prType: prType,
          },
          orderBy: {
            value: 'desc',
          },
        });

        if (!existingPR || value > existingPR.value) {
          await ctx.db.exercisePersonalRecord.create({
            data: {
              exerciseId: input.exerciseId,
              userId: userId,
              sessionExerciseId: input.sessionExerciseId,
              setId: input.setId,
              prType: prType,
              value: value,
            },
          });
          newPRsCount++;
        }
      }

      return { newPRsCount };
    }),

  checkAndCreatePRs: publicProcedure
    .input(z.array(z.object({
      exerciseId: z.number(),
      sessionExerciseId: z.number(),
      setId: z.number(),
      reps: z.number(),
      weight: z.number(),
    })))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      let totalNewPRs = 0;
      const prTypes = ['HighestWeight', 'HighestVolume', 'HighestOneRepMax'] as const;

      // First, get all existing PRs for all exercises in one query
      const existingPRs = await ctx.db.exercisePersonalRecord.findMany({
        where: {
          exerciseId: { in: input.map(i => i.exerciseId) },
          userId: userId,
        },
        orderBy: {
          value: 'desc',
        },
      });

      const newPRs = [];
      
      for (const set of input) {
        for (const prType of prTypes) {
          let value: number;
          switch (prType) {
            case 'HighestWeight':
              value = set.weight;
              break;
            case 'HighestVolume':
              value = set.reps * set.weight;
              break;
            case 'HighestOneRepMax':
              value = set.weight * (1 + set.reps / 30);
              break;
          }

          const existingPR = existingPRs.find(pr => 
            pr.exerciseId === set.exerciseId && 
            pr.prType === prType
          );

          if (!existingPR || value > existingPR.value) {
            newPRs.push({
              exerciseId: set.exerciseId,
              userId: userId,
              sessionExerciseId: set.sessionExerciseId,
              setId: set.setId,
              prType: prType,
              value: value,
            });
            totalNewPRs++;
          }
        }
      }

      if (newPRs.length > 0) {
        await ctx.db.exercisePersonalRecord.createMany({
          data: newPRs,
        });
      }

      return { newPRsCount: totalNewPRs };
    }),
});
