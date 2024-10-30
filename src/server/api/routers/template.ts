  import { createTRPCRouter as router, publicProcedure, protectedProcedure } from '../trpc';
  import { z } from 'zod';
  import { db as prisma } from '../../db';


  export const templateRouter = router({
    // Get template by ID when user == user or userId is empty
    getTemplateById: publicProcedure
      .input(z.object({
        id: z.number(),
        userId: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const template = await prisma.template.findFirst({
          include: {
            exercises: {
              include: {
                sets: true,
                exercise: true,
              },
            },
          },
          where: {
            id: input.id,
            userId: input.userId,
          },
        });
        return template;
      }),

    // Get all templates for a user
    getTemplatesUser: protectedProcedure
      .query(async ({ ctx }) => {
        return ctx.db.template.findMany({
          where: { userId: ctx.session.user.id },
          include: {
            store_listing: true,
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        });
      }),
    

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
            owner_id: input.userId,
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
          include: {
            sets: true,
          }
        });
        return templateExercise;
      }),

    // Get exercises in template
    getExercisesInTemplate: publicProcedure
      .input(z.object({
        templateId: z.number(),
      }))
      .query(async ({ input }) => {
        const exercises = await prisma.templateExercise.findMany({
          where: { templateId: input.templateId },
          orderBy: { order: 'asc' },
        });
        return exercises;
      }),

    deleteTemplate: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({input, ctx}) => {
        const {session} = ctx;

        await prisma.template.delete({
          where: {
            id: input.id,
            userId: session.user.id
          }
        });

        return {success: true};
      }),

    updateTemplate: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        note: z.string().optional(),
        // Add other fields as needed
      }))
      .mutation(async ({ input }) => {
        const updatedTemplate = await prisma.template.update({
          where: { id: input.id },
          data: {
            name: input.name,
            note: input.note,
            // Update other fields as needed
          },
        });
        return updatedTemplate;
      }),

  updateExerciseInTemplate: publicProcedure
    .input(z.object({
      id: z.number(),
      order: z.number().optional(),
      notes: z.string().optional(),
      // Add other fields as needed
    }))
    .mutation(async ({ input }) => {
      const updatedExercise = await prisma.templateExercise.update({
        where: { id: input.id },
        data: {
          order: input.order,
          notes: input.notes,
          // Update other fields as needed
        },
      });
      return updatedExercise;
    }),

  removeExerciseFromTemplate: publicProcedure
    .input(z.object({
      templateExerciseId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { templateExerciseId } = input;
      
      // First, delete all associated sets
      await prisma.templateExerciseSet.deleteMany({
        where: { templateExerciseId },
      });

      // Then, delete the template exercise
      await prisma.templateExercise.delete({
        where: { id: templateExerciseId },
      });

      return { success: true };
    }),


  updateSetInTemplate: publicProcedure
    .input(z.object({
      id: z.number(),
      reps: z.number().optional(),
      weight: z.number().optional(),
      type: z.enum(['Warmup', 'Regular', 'Dropset', 'Superset', 'Partials']).optional(),
    }))
    .mutation(async ({ input }) => {
      const updatedSet = await prisma.templateExerciseSet.update({
        where: { id: input.id },
        data: {
          reps: input.reps,
          weight: input.weight,
          type: input.type,
        },
      });
      return updatedSet;
    }),

    }); 
    
