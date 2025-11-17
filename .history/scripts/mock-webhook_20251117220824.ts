import { handleCheckoutSessionCompleted } from '../server/stripe/webhooks';

// Minimal fake Stripe Checkout Session object matching the parts used by the handler
const fakeSession: any = {
  id: 'evt_test_checkout_12345',
  customer: 'cus_test_12345',
  client_reference_id: 'user-42',
  metadata: {
    user_id: '42',
    customer_email: 'buyer@example.com',
    product_id: 'prod_course_professional',
    product_name: 'KI-Prompting Kurs - Professional',
  },
};

async function run() {
  console.log('Simulating checkout.session.completed handler with fake session:');
  console.log(JSON.stringify(fakeSession, null, 2));

  try {
    await handleCheckoutSessionCompleted(fakeSession as any);
    console.log('Mock webhook handler executed successfully.');
  } catch (err) {
    console.error('Error executing mock webhook handler:', err);
    process.exitCode = 1;
  }
}

run();
