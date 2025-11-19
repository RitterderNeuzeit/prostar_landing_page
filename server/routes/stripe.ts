import { Router, Request, Response } from "express";
import { createCheckoutSession } from "../stripe/checkout";
import { handleWebhook } from "../stripe/webhooks";

interface AuthRequest extends Request {
  user?: { id: number; email?: string; name?: string };
}

const router = Router();

/**
 * POST /api/stripe/checkout
 * Create a Stripe checkout session
 */
router.post("/checkout", async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      res.status(400).json({ error: "Missing productId" });
      return;
    }

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const origin = req.headers.origin || "http://localhost:3000";
    const successUrl = `${origin}/course?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/?canceled=true`;

    const checkoutUrl = await createCheckoutSession({
      userId: user.id.toString(),
      userEmail: user.email || "",
      userName: user.name || "Customer",
      productId,
      successUrl,
      cancelUrl,
      metadata: {
        source: "landing-page",
      },
    });

    res.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /api/stripe/webhook
 * Stripe webhook endpoint
 * IMPORTANT: This route must use express.raw() middleware
 */
router.post("/webhook", async (req: Request, res: Response) => {
  await handleWebhook(req, res);
});

/**
 * GET /api/stripe/customer-portal
 * Create a link to the Stripe customer portal
 */
router.get("/customer-portal", async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // TODO: Implement customer portal session creation
    // This requires storing stripe_customer_id in the database

    res.status(501).json({ error: "Customer portal not yet implemented" });
  } catch (error) {
    console.error("Customer portal error:", error);
    res.status(500).json({ error: "Failed to create customer portal session" });
  }
});

export default router;
