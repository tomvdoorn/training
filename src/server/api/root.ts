import { exerciseRouter } from "./routers/excerise";
import { templateRouter } from "./routers/template";
import { sessionRouter } from "./routers/session";
import { setRouter } from "./routers/sets";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  exercise: exerciseRouter,
  template: templateRouter,
  set: setRouter,
  session: sessionRouter,
  user: userRouter,
  auth: authRouter

});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
