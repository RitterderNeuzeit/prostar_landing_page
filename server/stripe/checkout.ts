import Stripe from 'stripe';
import { courseProducts, subscriptionProducts } from './products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export interface CheckoutSessionParams {
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(params: CheckoutSessionParams): Promise<string> {
  const { userId, userEmail, userName, productId, successUrl, cancelUrl, metadata = {} } = params;

  // Find the product
  const allProducts = [...courseProducts, ...subscriptionProducts];
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  if (product.prices.length === 0) {
    throw new Error(`No prices found for product: ${productId}`);
  }

  const price = product.prices[0];

  // Build line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: price.id,
      quantity: 1,
    },
  ];

  // Create session parameters
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: product.type === 'subscription' ? 'subscription' : 'payment',
    customer_email: userEmail,
    client_reference_id: userId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata: {
      user_id: userId,
      customer_email: userEmail,
      customer_name: userName,
      product_id: productId,
      product_name: product.name,
      ...metadata,
    },
  };

  // Add trial period for subscriptions if applicable
  if (product.type === 'subscription' && price.trialDays) {
    sessionParams.subscription_data = {
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
      trial_period_days: price.trialDays,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    return session.url || '';
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error;
  }
}

/**
 * Retrieve checkout session details
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Failed to retrieve checkout session:', error);
    throw error;
  }
}

/**
 * List customer's past checkout sessions
 */
export async function listCustomerSessions(email: string): Promise<Stripe.Checkout.Session[]> {
  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });
    // Filter by email on the client side since Stripe API doesn't support customer_email filter
    return sessions.data.filter((s) => s.customer_email === email);
  } catch (error) {
    console.error('Failed to list customer sessions:', error);
    throw error;
  }
}
