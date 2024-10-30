import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { db as prisma } from "~/server/db"

export const trainingPlanRouter = createTRPCRouter({
  getTrainingPlans: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.trainingPlan.findMany({
        where: { userId: input.userId },
        include: {
          templates: true,
          store_listing: true
        }
      });
    }),
  createTrainingPlan: protectedProcedure
    .input(z.object({
      name: z.string(),
      duration: z.number(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
      templates: z.array(z.object({
        templateId: z.string().nullable(),
        day: z.number(),
        userId: z.string()
      })),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { templates, ...trainingPlanData } = input;
      
      return ctx.db.trainingPlan.create({
        data: {
          ...trainingPlanData,
          owner_id: input.userId,

          templates: {
            create: templates.map(template => ({
              templateId: template?.templateId ? parseInt(template.templateId) : null,
              day: template.day,
              userId: input.userId
            }))
          }
        },
        include: {
          templates: true
        }
      });
    }),
  createTrainingPlanTemplate: protectedProcedure
    .input(z.object({ 
      trainingPlanId: z.string(), 
      templateId: z.string().optional(), 
      day: z.number(), 
      userId: z.string() 
    }))
    .mutation(async ({ ctx, input }) => {
      const { trainingPlanId, ...rest } = input;
      return ctx.db.trainingPlanTemplate.create({ 
        data: {
          planId: parseInt(trainingPlanId),
          ...rest,
          templateId: rest.templateId ? parseInt(rest.templateId) : null
        }
      });
    }),
  createSessionsFromPlan: protectedProcedure
    .input(z.object({
      trainingPlanId: z.string(),
      startDate: z.date(),
      repeatCount: z.number(),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { trainingPlanId, startDate, repeatCount, userId } = input;
      const plan = await ctx.db.trainingPlan.findUnique({
        where: { id: parseInt(trainingPlanId) },
        include: { templates: true },
      });

      if (!plan) {
        throw new Error("Training plan not found");
      }

      const sessions = [];
      for (let i = 0; i < repeatCount; i++) {
        for (const template of plan.templates) {
          // Skip if templateId is null
          if (template.templateId === null) continue;
          
          const sessionDate = new Date(startDate);
          sessionDate.setDate(sessionDate.getDate() + (i * plan.duration) + (template.day - 1));
          sessions.push({
            userId,
            templateId: template.templateId,
            startTime: sessionDate,
            endTime: new Date(sessionDate.getTime() + 60 * 60 * 1000), // Assuming 1-hour sessions
            completed: false,
          });
        }
      }

      return ctx.db.trainingSession.createMany({ data: sessions });
    }),
  deletePlan: protectedProcedure
    .input(z.object({
      planId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First delete all associated templates
      await ctx.db.trainingPlanTemplate.deleteMany({
        where: { planId: parseInt(input.planId) },
      });

      // Then delete the plan itself
      return ctx.db.trainingPlan.delete({
        where: { id: parseInt(input.planId) },
      });
    }),
  updateTrainingPlan: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      duration: z.number(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
      templates: z.array(z.object({
        templateId: z.string().nullable(),
        day: z.number(),
        userId: z.string()
      })),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, templates, ...trainingPlanData } = input;

      // Delete existing templates
      await ctx.db.trainingPlanTemplate.deleteMany({
        where: { planId: id },
      });

      // Update plan and create new templates
      return ctx.db.trainingPlan.update({
        where: { id },
        data: {
          ...trainingPlanData,
          templates: {
            create: templates.map(template => ({
              templateId: template?.templateId ? parseInt(template.templateId) : null,
              day: template.day,
              userId: input.userId
            }))
          }
        },
        include: {
          templates: true,
          store_listing: true
        }
      });
    }),
  // Add other training plan related procedures here
})
