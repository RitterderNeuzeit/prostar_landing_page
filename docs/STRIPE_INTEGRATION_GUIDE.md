# Stripe Integration Guide

This document explains how the Stripe payment system is integrated into the ProStar Landing Page.

## Overview

The Stripe integration enables:

- One-time course purchases (Starter, Professional, Enterprise tiers)
- Subscription management (coaching, community access)
- Webhook handling for payment events
- Customer portal for subscription management
- Payment history and invoice tracking

## Architecture

### Directory Structure

```
server/
├── stripe/
│   ├── products.ts      # Product and price definitions
│   ├── checkout.ts      # Checkout session creation
│   └── webhooks.ts      # Webhook event handlers
└── routes/
    └── stripe.ts        # API routes for Stripe operations
```

### Key Components

#### 1. Products (`server/stripe/products.ts`)

Defines all products and prices:

- **Course Products** (one-time purchases)
  - Starter: €97 (3 modules)
  - Professional: €197 (8 modules)
  - Enterprise: €497 (9 modules)

- **Subscription Products** (recurring)
  - Coaching: €299/month (7-day trial)
  - Community: €49/month

#### 2. Checkout (`server/stripe/checkout.ts`)

Handles checkout session creation:

```typescript
const checkoutUrl = await createCheckoutSession({
  userId: user.id.toString(),
  userEmail: user.email,
  userName: user.name,
  productId: "prod_course_professional",
  successUrl: "https://example.com/course?session_id={CHECKOUT_SESSION_ID}",
  cancelUrl: "https://example.com/?canceled=true",
});
```

#### 3. Webhooks (`server/stripe/webhooks.ts`)

Processes Stripe events:

- `checkout.session.completed` - Grant course access
- `payment_intent.succeeded` - Payment confirmation
- `customer.subscription.created` - Subscription started
- `customer.subscription.updated` - Subscription changed
- `invoice.paid` - Invoice payment received

#### 4. API Routes (`server/routes/stripe.ts`)

Exposes endpoints:

- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Webhook endpoint
- `GET /api/stripe/customer-portal` - Customer portal link

## Setup Instructions

### 1. Environment Variables

The following variables are automatically configured:

```
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

If you need to update them, go to **Settings → Payment** in the Management UI.

### 2. Register Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → Webhooks**
3. Click **Add endpoint**
4. Set endpoint URL: `https://yourdomain.com/api/stripe/webhook`
5. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

### 3. Create Products in Stripe Dashboard

1. Go to **Products** in Stripe Dashboard
2. Create the following products:

**Course Products (One-time)**

- Name: "KI-Prompting Kurs - Starter"
- Price: €97
- Metadata: `tier: starter`

- Name: "KI-Prompting Kurs - Professional"
- Price: €197
- Metadata: `tier: professional`

- Name: "KI-Prompting Kurs - Enterprise"
- Price: €497
- Metadata: `tier: enterprise`

**Subscription Products**

- Name: "KI-Coaching - Monatlich"
- Price: €299/month
- Trial: 7 days

- Name: "KI-Community - Monatlich"
- Price: €49/month

## Testing

### Test Card Numbers

Use these card numbers in test mode:

| Number              | Result             |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined      |
| 4000 0025 0000 3155 | 3D Secure required |

### Test Webhook Events

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Find your endpoint
3. Click **Send test event**
4. Select event type (e.g., `checkout.session.completed`)
5. Click **Send event**

The webhook handler will automatically detect test events and respond appropriately.

## Database Schema

The following fields should be stored in your database:

```typescript
// On User table
stripe_customer_id: string; // Stripe Customer ID

// On Order/Purchase table
stripe_session_id: string;
stripe_payment_intent_id: string;
user_id: number;
product_id: string;
tier: "starter" | "professional" | "enterprise";
amount: number;
currency: string;
status: "pending" | "completed" | "failed";
purchase_date: Date;

// On Subscription table
stripe_subscription_id: string;
user_id: number;
product_id: string;
status: "active" | "past_due" | "canceled" | "unpaid";
current_period_start: Date;
current_period_end: Date;
cancel_at_period_end: boolean;
```

## Frontend Integration

### Creating a Checkout Session

```typescript
// In your component
const handleCheckout = async (productId: string) => {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  const { url } = await response.json();
  window.open(url, "_blank");
};
```

### Handling Success

After successful payment, users are redirected to `/course?session_id={CHECKOUT_SESSION_ID}`.

The course page:

1. Retrieves the session ID from URL
2. Verifies the payment in localStorage
3. Grants course access
4. Displays course modules

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook endpoint URL is correct
2. Verify webhook secret is set in environment variables
3. Check Stripe Dashboard → Developers → Webhooks for event logs
4. Ensure endpoint responds with `{ received: true }`

### Payment Session Not Creating

1. Verify product IDs match Stripe Dashboard
2. Check Stripe API keys are correct
3. Ensure user email is provided
4. Check server logs for error messages

### Customer Portal Not Working

1. Implement `POST /api/stripe/customer-portal`
2. Store `stripe_customer_id` in database
3. Create portal session with Stripe API
4. Return portal URL to frontend

## Production Checklist

- [ ] Claim Stripe sandbox at https://dashboard.stripe.com/claim_sandbox
- [ ] Complete Stripe KYC verification
- [ ] Update to live API keys
- [ ] Test all payment flows with live cards
- [ ] Set up email notifications for failed payments
- [ ] Implement refund handling
- [ ] Add payment history UI
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Set up error alerts and logging
- [ ] Document refund policy

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
