import dotenv from "dotenv";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: process.env.TRPC_URL || "http://localhost:3000/api/trpc",
      transformer: superjson,
      fetch: (input, init) => globalThis.fetch(input, init),
    }),
  ],
});

async function main() {
  const email = process.argv[2] || "info.prostar@gmx.de";
  const name = process.argv[3] || "Website-User";

  console.log("Calling course.register for", email);

  try {
    const res = await trpc.course.register.mutate({
      name,
      email,
      courseName: "free-mini-course",
    });
    console.log("Response:", res);
  } catch (err) {
    console.error("tRPC call error:");
    console.error(err);
    process.exit(2);
  }
}

main();
