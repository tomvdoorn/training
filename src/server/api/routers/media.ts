import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createServerSupabaseClient } from "~/utils/supabase-server";
import { TRPCError } from "@trpc/server";

const supabase = createServerSupabaseClient();

export const mediaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        fileUrl: z.string(),
        fileType: z.string(),
        trainingSessionId: z.number().optional(),
        sessionExerciseId: z.number().optional(),
        postId: z.number().optional(),
        setIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.media.create({
        data: {
          fileUrl: input.fileUrl,
          fileType: input.fileType,
          trainingSessionId: input.trainingSessionId,
          sessionExerciseId: input.sessionExerciseId,
          postId: input.postId,
          sessionExerciseSetId: input.setIds ? input.setIds[0] : null,
        },
      });
    }),

  getByTrainingSession: protectedProcedure
    .input(z.object({ trainingSessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.media.findMany({
        where: {
          trainingSessionId: input.trainingSessionId,
        },
      });
    }),

  getBySessionExercise: protectedProcedure
    .input(z.object({ sessionExerciseId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.media.findMany({
        where: {
          sessionExerciseId: input.sessionExerciseId,
        },
      });
    }),

  getByPost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.media.findMany({
        where: {
          postId: input.postId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // First get the media record to get the fileUrl
      const media = await ctx.db.media.findUnique({
        where: { id: input.id },
      });

      if (!media) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Media not found',
        });
      }

      // Extract the file path from the Supabase URL
      const fileUrl = new URL(media.fileUrl);
      const filePath = fileUrl.pathname.split('/').pop();

      if (!filePath) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Invalid file URL',
        });
      }

      // Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete file from storage',
        });
      }

      // Delete the database record
      return ctx.db.media.delete({
        where: { id: input.id },
      });
    }),

  // New procedure to handle direct file uploads
  getUploadUrl: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const fileExtension = input.fileName.split('.').pop()?.toLowerCase() ?? '';
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

      // Get signed URL for upload
      const { data, error } = await supabase.storage
        .from('media')
        .createSignedUploadUrl(uniqueFileName);

      if (error ?? !data) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate upload URL',
        });
      }

      return {
        uploadUrl: data.signedUrl,
        fileUrl: supabase.storage
          .from('media')
          .getPublicUrl(uniqueFileName).data.publicUrl,
      };
    }),
});

