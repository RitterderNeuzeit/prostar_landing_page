/**
 * Stripe Products Configuration
 * Define all products and prices for the ProStar courses
 *
 * IMPORTANT: These are product definitions for reference.
 * In production, manage products through the Stripe Dashboard.
 * This file documents the product structure for the application.
 */

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  type: "one-time" | "subscription";
  prices: StripePrice[];
  metadata?: Record<string, string>;
}

export interface StripePrice {
  id: string;
  amount: number; // in cents
  currency: string;
  interval?: "month" | "year";
  intervalCount?: number;
  trialDays?: number;
}

/**
 * Course Products
 * These match the course tiers defined in courseData.ts
 */
export const courseProducts: StripeProduct[] = [
  {
    id: "prod_course_starter",
    name: "KI-Prompting Kurs - Starter",
    description: "5 Video-Module, Workbooks & Templates, Lebenslanger Zugriff",
    type: "one-time",
    prices: [
      {
        id: "price_course_starter_eur",
        amount: 9700, // €97.00
        currency: "eur",
      },
    ],
    metadata: {
      tier: "starter",
      modules: "3",
      courseId: "ki-prompting-course",
    },
  },
  {
    id: "prod_course_professional",
    name: "KI-Prompting Kurs - Professional",
    description: "Alle Starter-Inhalte + Bonus Fallstudien + Community Forum",
    type: "one-time",
    prices: [
      {
        id: "price_course_professional_eur",
        amount: 19700, // €197.00
        currency: "eur",
      },
    ],
    metadata: {
      tier: "professional",
      modules: "8",
      courseId: "ki-prompting-course",
    },
  },
  {
    id: "prod_course_enterprise",
    name: "KI-Prompting Kurs - Enterprise",
    description: "Alle Professional-Inhalte + 1:1 Coaching + Mehrplatz-Lizenz",
    type: "one-time",
    prices: [
      {
        id: "price_course_enterprise_eur",
        amount: 49700, // €497.00
        currency: "eur",
      },
    ],
    metadata: {
      tier: "enterprise",
      modules: "9",
      courseId: "ki-prompting-course",
    },
  },
];

/**
 * Subscription Products
 * For recurring services (coaching, community access, etc.)
 */
export const subscriptionProducts: StripeProduct[] = [
  {
    id: "prod_coaching_monthly",
    name: "KI-Coaching - Monatlich",
    description: "Monatliche 1:1 Coaching Sessions mit KI-Experten",
    type: "subscription",
    prices: [
      {
        id: "price_coaching_monthly_eur",
        amount: 29900, // €299.00/month
        currency: "eur",
        interval: "month",
        trialDays: 7,
      },
    ],
    metadata: {
      subscriptionType: "coaching",
      sessions: "4",
    },
  },
  {
    id: "prod_community_monthly",
    name: "KI-Community - Monatlich",
    description: "Exklusiver Zugang zur Community, Ressourcen und Updates",
    type: "subscription",
    prices: [
      {
        id: "price_community_monthly_eur",
        amount: 4900, // €49.00/month
        currency: "eur",
        interval: "month",
      },
    ],
    metadata: {
      subscriptionType: "community",
    },
  },
];

/**
 * Get product by ID
 */
export function getProductById(productId: string): StripeProduct | undefined {
  const allProducts = [...courseProducts, ...subscriptionProducts];
  return allProducts.find(p => p.id === productId);
}

/**
 * Get price by ID
 */
export function getPriceById(priceId: string): StripePrice | undefined {
  const allProducts = [...courseProducts, ...subscriptionProducts];
  for (const product of allProducts) {
    const price = product.prices.find(p => p.id === priceId);
    if (price) return price;
  }
  return undefined;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = "eur"): string {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  });
  return formatter.format(amount / 100);
}
