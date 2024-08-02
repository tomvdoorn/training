import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { createTRPCRouter as router, publicProcedure, protectedProcedure } from '../trpc';




export const authRouter = router({
  signUp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { email, password, firstName, lastName } = input;
      const hashedPassword = await hash(password, 12);

      const user = await ctx.db.user.create({
        data: {
            email,
            firstName,
            lastName,
            password: hashedPassword,
        },
      });

      return { success: true, user };
    }),
    //implement a change password logic

changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, newPassword } = input;
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await compare(currentPassword, user.password!);

      if (!isPasswordValid) {
        throw new Error("Invalid current password");
      }

      const hashedNewPassword = await hash(newPassword, 12);

      const updatedUser = await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return { success: true, user: updatedUser };
    }),
});