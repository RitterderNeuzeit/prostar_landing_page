import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  tier: "starter" | "professional" | "enterprise";
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutButton({
  tier,
  children,
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/checkout/${tier}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tier,
          email: "customer@example.com", // In production, get from user session
          name: "Customer", // In production, get from user session
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        "Fehler beim Erstellen der Checkout-Sitzung. Bitte versuchen Sie es erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleCheckout} disabled={loading} className={className}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird geladen...
          </>
        ) : (
          children
        )}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  );
}
