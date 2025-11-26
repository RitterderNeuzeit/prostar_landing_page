// tRPC router template
// Minimal example to copy into `server/routers.ts` or a new feature file.
// Keep this file as a template — adapt imports/procedure helpers to match your project's tRPC setup.

/* Example (adjust to your tRPC helper names):
import { router, publicProcedure } from '@trpc/server';
import { z } from 'zod';

export const myFeatureRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({ message: `Hello ${input?.name ?? 'world'}` })),
});

// Then in `server/routers.ts` attach it:
// import { myFeatureRouter } from './templates/trpc-router-template';
// export const appRouter = router({ myFeature: myFeatureRouter, ... });
*/

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
