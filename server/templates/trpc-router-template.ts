import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

// Template for adding a new feature router
// Usage:
// 1. Copy this file to `server/routers/<feature>.ts` or import and add to `server/routers.ts`
// 2. Add `import { myFeatureRouter } from './routers/<feature>';` and include in `appRouter`

export const myFeatureRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Access request context via `ctx` (e.g. ctx.user, ctx.db)
      // Replace with real DB call: await ctx.db.someTable.findUnique(...)
      return { id: input.id, name: "example" };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Example mutation that requires auth
      // const created = await ctx.db.table.insert({ ... })
      return { success: true };
    }),
});

export default myFeatureRouter;
