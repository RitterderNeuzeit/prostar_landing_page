import { Router, Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const router = Router();

interface CheckoutRequest extends Request {
  body: {
    tier: "starter" | "professional" | "enterprise";
    email?: string;
    name?: string;
  };
}

/**
 * Product IDs and prices for each tier
 * These should match your Stripe Dashboard products
 */
const PRODUCTS = {
  starter: {
    priceId: "price_course_starter_eur",
    name: "KI-Prompting Kurs - Starter",
    amount: 9700,
    currency: "eur",
    tier: "starter",
  },
  professional: {
    priceId: "price_course_professional_eur",
    name: "KI-Prompting Kurs - Professional",
    amount: 19700,
    currency: "eur",
    tier: "professional",
  },
  enterprise: {
    priceId: "price_course_enterprise_eur",
    name: "KI-Prompting Kurs - Enterprise",
    amount: 49700,
    currency: "eur",
    tier: "enterprise",
  },
};

/**
 * POST /api/checkout/starter
 * Create checkout session for Starter tier
 */
router.post("/starter", async (req: CheckoutRequest, res: Response) => {
  try {
    const { email = "guest@example.com", name = "Guest" } = req.body;
    const product = PRODUCTS.starter;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${req.headers.origin || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&tier=starter`,
      cancel_url: `${req.headers.origin || "http://localhost:3000"}/?canceled=true`,
      allow_promotion_codes: true,
      metadata: {
        tier: product.tier,
        customer_name: name,
        customer_email: email,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Starter checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /api/checkout/professional
 * Create checkout session for Professional tier
 */
router.post("/professional", async (req: CheckoutRequest, res: Response) => {
  try {
    const { email = "guest@example.com", name = "Guest" } = req.body;
    const product = PRODUCTS.professional;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${req.headers.origin || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&tier=professional`,
      cancel_url: `${req.headers.origin || "http://localhost:3000"}/?canceled=true`,
      allow_promotion_codes: true,
      metadata: {
        tier: product.tier,
        customer_name: name,
        customer_email: email,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Professional checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /api/checkout/enterprise
 * Create checkout session for Enterprise tier
 */
router.post("/enterprise", async (req: CheckoutRequest, res: Response) => {
  try {
    const { email = "guest@example.com", name = "Guest" } = req.body;
    const product = PRODUCTS.enterprise;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${req.headers.origin || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&tier=enterprise`,
      cancel_url: `${req.headers.origin || "http://localhost:3000"}/?canceled=true`,
      allow_promotion_codes: true,
      metadata: {
        tier: product.tier,
        customer_name: name,
        customer_email: email,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Enterprise checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /api/checkout/mini-lesson
 * Create checkout session for free mini-lesson opt-in
 */
router.post("/mini-lesson", async (req: CheckoutRequest, res: Response) => {
  try {
    const { email = "", name = "Guest" } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    // For free mini-lesson, just store email and redirect
    // In production, you'd save this to a database or email service
    console.log(`Mini-lesson opt-in: ${name} (${email})`);

    res.json({
      success: true,
      message:
        "Vielen Dank! Überprüfen Sie Ihr E-Mail-Postfach für die kostenlose Lektion.",
      redirectUrl: "/mini-lesson-sent",
    });
  } catch (error) {
    console.error("Mini-lesson opt-in error:", error);
    res.status(500).json({ error: "Failed to process opt-in" });
  }
});

/**
 * GET /api/checkout/session/:sessionId
 * Retrieve checkout session details
 */
router.get("/session/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
});

export default router;
