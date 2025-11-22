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
  const email = process.argv[2] || "neuer.test@example.com";
  const code = process.argv[3] || "neuer.te_2d83503d36a646bb8c52";

  console.log("Verifying access...");
  console.log("Email:", email);
  console.log("Code:", code);

  try {
    const res = await trpc.course.verify.query({ email, accessKey: code });
    console.log("\n✅ Verification Response:");
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("\n❌ tRPC call error:");
    console.error(err);
    process.exit(2);
  }
}

main();
