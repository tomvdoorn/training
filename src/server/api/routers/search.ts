// src/server/api/routers/search.ts
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const searchRouter = createTRPCRouter({
  searchUsersAndTemplates: protectedProcedure
    .input(z.object({ term: z.string() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            { firstName: { contains: input.term, mode: 'insensitive' } },
            { lastName: { contains: input.term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, firstName: true, lastName: true },
      })

      const templates = await ctx.db.template.findMany({
        where: {
          OR: [
            { name: { contains: input.term, mode: 'insensitive' } },
            { userId: undefined },
            { userId: ctx.session.user.id },
          ],
        },
        select: { id: true, name: true },
      })

      return [
        ...users.map(user => ({ 
          ...user, 
          type: 'user' as const,
          name: `${user.firstName} ${user.lastName}`.trim(),
        })),
        ...templates.map(template => ({ ...template, type: 'template' as const })),
      ]
    }),
})
