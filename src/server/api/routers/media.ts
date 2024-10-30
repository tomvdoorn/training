import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export const mediaRouter = createTRPCRouter({
  uploadSessionExerciseMedia: protectedProcedure
    .input(z.object({
      sessionExerciseId: z.number(),
      file: z.object({
        name: z.string(),
        type: z.string(),
        base64: z.string(),
      }),
      setIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!supabase) {
        throw new Error("Supabase configuration is missing");
      }

      const fileName = `${ctx.session.user.id}/${input.sessionExerciseId}/${Date.now()}_${input.file.name}`;
      const fileType = input.file.type.startsWith('image/') ? 'image' : 'video';
      
      // Convert base64 to buffer
      const base64Data = input.file.base64.split(',')[1] ?? '';
      const buffer = Buffer.from(base64Data, 'base64');

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('workout-media')
        .upload(fileName, buffer, {
          contentType: input.file.type,
          cacheControl: '3600',
        });

      if (error) {
        throw new Error(`Failed to upload media: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('workout-media')
        .getPublicUrl(fileName);

      // Save media reference to database
      const media = await ctx.db.sessionExerciseMedia.create({
        data: {
          fileUrl: publicUrl,
          fileType: fileType,
          sessionExerciseId: input.sessionExerciseId,
          setIds: input.setIds,
        },
      });

      return media;
    }),

  getSessionExerciseMedia: protectedProcedure
    .input(z.object({
      sessionExerciseId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.sessionExerciseMedia.findMany({
        where: {
          sessionExerciseId: input.sessionExerciseId,
        },
      });
    }),
});

