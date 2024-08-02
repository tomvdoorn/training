  import { createTRPCRouter as router, publicProcedure, protectedProcedure } from '../trpc';
  import { z } from 'zod';
  import { db as prisma } from '../../db';


  export const userRouter = router({
    updateDetails: protectedProcedure

      .input(z.object({
        id: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional()
      }))
      .mutation(async ({ input }) => {
        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: input
        });
        return updatedUser
      })
    })
