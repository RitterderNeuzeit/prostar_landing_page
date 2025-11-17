import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Verify and process Stripe webhook events
 */
export async function handleWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
    return;
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected:', event.type);
    res.json({ verified: true });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle checkout.session.completed event
 * This fires when a customer completes a payment
 */
export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  console.log('[Webhook] Checkout session completed:', {
    sessionId: session.id,
    customerId: session.customer,
    clientReferenceId: session.client_reference_id,
    metadata: session.metadata,
  });

  // Extract user information from metadata
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.customer_email;
  const productId = session.metadata?.product_id;
  const productName = session.metadata?.product_name;

  if (!userId || !userEmail) {
    console.warn('[Webhook] Missing user information in session metadata');
    return;
  }

  // TODO: Update user's course access in database
  // Example:
  // await db.userCourseAccess.create({
  //   userId,
  //   productId,
  //   stripeSessionId: session.id,
  //   purchaseDate: new Date(),
  //   status: 'active',
  // });

  console.log(`[Webhook] Course access granted for user ${userId}: ${productName}`);
}

/**
 * Handle payment_intent.succeeded event
 */
export async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('[Webhook] Payment intent succeeded:', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata,
  });

  // TODO: Update payment status in database if needed
}

/**
 * Handle payment_intent.payment_failed event
 */
export async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.error('[Webhook] Payment intent failed:', {
    paymentIntentId: paymentIntent.id,
    lastPaymentError: paymentIntent.last_payment_error,
  });

  // TODO: Notify user of payment failure
}

/**
 * Handle customer.subscription.created event
 */
export async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  console.log('[Webhook] Subscription created:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
  });

  // TODO: Store subscription information in database
}

/**
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  console.log('[Webhook] Subscription updated:', {
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  // TODO: Update subscription status in database
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  console.log('[Webhook] Subscription deleted:', {
    subscriptionId: subscription.id,
    canceledAt: subscription.canceled_at,
  });

  // TODO: Mark subscription as cancelled in database
}

/**
 * Handle invoice.paid event
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const inv = invoice as any;
  const subscriptionId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id;
  console.log('[Webhook] Invoice paid:', {
    invoiceId: invoice.id,
    amount: invoice.amount_paid,
    subscriptionId,
  });

  // TODO: Update invoice status in database
}

/**
 * Handle invoice.payment_failed event
 */
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const inv = invoice as any;
  const subscriptionId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id;
  console.error('[Webhook] Invoice payment failed:', {
    invoiceId: invoice.id,
    subscriptionId,
  });

  // TODO: Notify user of failed payment
}
