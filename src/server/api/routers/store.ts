import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Exercise, TemplateExercise, TemplateExerciseSet, Prisma } from "@prisma/client"


export const storeRouter = createTRPCRouter({
  // List all store items
  getListings: protectedProcedure
    .input(z.object({
      type: z.enum(["Template", "TrainingPlan"]).optional(),
      skip: z.number().optional(),
      take: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.storeListing.findMany({
        where: {
          type: input.type,
          status: "Active",
        },
        include: {
          template: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                  sets: true,
                }
              }
            }
          },
          training_plan: {
            include: {
              templates: true,
            }
          }
        },
        skip: input.skip,
        take: input.take ?? 10,
      });
    }),

  // Create store listing
  createListing: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      preview_image: z.string().optional(),
      type: z.enum(["Template", "TrainingPlan"]),
      template_id: z.number().optional(),
      training_plan_id: z.number().optional(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      if (input.template_id) {
        const template = await ctx.db.template.findUnique({
          where: { id: input.template_id },
          select: {
            id: true,
            owner_id: true,
            is_copy: true,
          }
        });
        
        if (!template || template.owner_id !== ctx.session.user.id || template.is_copy) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only list templates you own originally",
          });
        }
      }

      if (input.training_plan_id) {
        const plan = await ctx.db.trainingPlan.findUnique({
          where: { id: input.training_plan_id }
        });
        
        if (!plan || plan.owner_id !== ctx.session.user.id || plan.is_copy) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only list training plans you own originally",
          });
        }
      }

      // If it's a training plan, update its difficulty
      if (input.type === "TrainingPlan" && input.training_plan_id && input.difficulty) {
        await ctx.db.trainingPlan.update({
          where: { id: input.training_plan_id },
          data: { difficulty: input.difficulty }
        });
      }

      return ctx.db.storeListing.create({
        data: input,
      });
    }),

  // Acquire (get for free) a template or plan
  acquireItem: protectedProcedure
    .input(z.object({
      listing_id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.db.storeListing.findUnique({
        where: { id: input.listing_id },
        include: {
          template: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                  sets: true,
                }
              }
            }
          },
          training_plan: {
            include: {
              templates: true,
            }
          }
        }
      });
      console.log("listing", listing)

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store listing not found",
        });
      }

      // Check if user already has this item
      const existingAcquisition = await ctx.db.acquisition.findFirst({
        where: {
          user_id: ctx.session.user.id,
          OR: [
            { template_id: listing.template_id },
            { training_plan_id: listing.training_plan_id },
          ],
        },
      });

      if (existingAcquisition) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have this item",
        });
      }
      // Create copy and acquisition in a transaction
      return ctx.db.$transaction(async (tx) => {
        let copiedItemId: number | null = null;

        if (listing?.template) {
          const templateData: Prisma.TemplateCreateInput = {
            name: listing.template.name,
            user: { connect: { id: ctx.session.user.id } },
            owner: { connect: { id: ctx.session.user.id } },
            is_copy: true,
            original: { connect: { id: listing.template.id } },
            exercises: {
              create: listing.template.exercises.map((ex: TemplateExercise & { exercise: Exercise } & { sets: TemplateExerciseSet[] }) => ({
                exerciseId: ex.exercise.id,
                order: ex.order,
                notes: ex.notes,
                sets: {
                  create: ex.sets.map((set: TemplateExerciseSet) => ({
                    reps: set.reps,
                    weight: set.weight,
                    type: set.type,
                    duration: set.duration,
                    distance: set.distance,
                    rpe: set.rpe,
                  }))
                }
              }))
            }
          };

          const copiedTemplate = await tx.template.create({
            data: templateData,
          });
          copiedItemId = copiedTemplate.id;
        }
        console.log("HOI!")
        console.log("listing", listing.training_plan)
        if (listing.training_plan) {
          const copiedPlan = await tx.trainingPlan.create({
            data: {
              name: listing.training_plan.name,
              duration: listing.training_plan.duration,
              difficulty: listing.training_plan.difficulty,
              userId: ctx.session.user.id,
              owner_id: ctx.session.user.id,
              is_copy: true,
              original_id: listing.training_plan.id,
              templates: {
                create: listing.training_plan.templates.map(template => ({
                  day: template.day,
                  templateId: template.templateId,
                  userId: ctx.session.user.id
                }))
              }
            },
          });
          copiedItemId = copiedPlan.id;
        }

        // Create acquisition record
        await tx.acquisition.create({
          data: {
            user_id: ctx.session.user.id,
            template_id: listing.type === "Template" ? copiedItemId : null,
            training_plan_id: listing.type === "TrainingPlan" ? copiedItemId : null,
          },
        });

        // Update purchase count
        await tx.storeListing.update({
          where: { id: listing.id },
          data: {
            purchase_count: {
              increment: 1,
            },
          },
        });

        return { success: true, copied_id: copiedItemId };
      });
    }),

  // Add this to your existing store router
  getListingByTemplateId: protectedProcedure
    .input(z.object({
      template_id: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.storeListing.findUnique({
        where: { template_id: input.template_id },
      });
    }),

  getListingByPlanId: protectedProcedure
    .input(z.object({
      training_plan_id: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.storeListing.findUnique({
        where: { training_plan_id: input.training_plan_id },
      });
    }),

  // Add this to the storeRouter
  updateListing: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      preview_image: z.string().optional(),
      status: z.enum(["Active", "Inactive"]).optional(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.db.storeListing.findUnique({
        where: { id: input.id },
        include: {
          template: true,
          training_plan: true,
        },
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store listing not found",
        });
      }

      // Verify ownership
      if (listing.template && listing.template.owner_id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own listings",
        });
      }

      if (listing.training_plan && listing.training_plan.owner_id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own listings",
        });
      }

      return ctx.db.storeListing.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          preview_image: input.preview_image,
          status: input.status,
        },
      });
    }),

  // Add this to get a specific listing
  getListingById: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.storeListing.findUnique({
        where: { id: input.id },
        include: {
          template: true,
          training_plan: true,
        },
      });
    }),
});
