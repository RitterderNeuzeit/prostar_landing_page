// Ensure Stripe can be constructed (dummy test key) before importing modules that initialize Stripe
process.env.STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_local";
process.env.STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET || "whsec_dummy";

// Minimal fake Stripe Checkout Session object matching the parts used by the handler
const fakeSession: any = {
  id: "evt_test_checkout_12345",
  customer: "cus_test_12345",
  client_reference_id: "user-42",
  metadata: {
    user_id: "42",
    customer_email: "buyer@example.com",
    product_id: "prod_course_professional",
    product_name: "KI-Prompting Kurs - Professional",
  },
};

async function run() {
  // Import after env is set so Stripe constructor in the module won't fail
  const webhooks = await import("../server/stripe/webhooks");
  console.log(
    "Simulating checkout.session.completed handler with fake session:"
  );
  console.log(JSON.stringify(fakeSession, null, 2));

  try {
    await webhooks.handleCheckoutSessionCompleted(fakeSession as any);
    console.log("Mock webhook handler executed successfully.");
  } catch (err) {
    console.error("Error executing mock webhook handler:", err);
    process.exitCode = 1;
  }
}

run();
