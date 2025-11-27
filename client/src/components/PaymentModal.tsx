import React, { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  price: number;
  tier: "starter" | "professional" | "enterprise";
  onPaymentSuccess?: (orderId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  price,
  tier,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const { addNotification } = useNotification();

  if (!isOpen) return null;

  const handlePayPalPayment = async () => {
    if (!email || !fullName) {
      addNotification({
        type: "warning",
        title: "Felder erforderlich",
        message: "Bitte füllen Sie alle Felder aus.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate PayPal payment processing
      // In production, this would integrate with PayPal SDK
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderId = `ORDER-${Date.now()}`;

      addNotification({
        type: "success",
        title: "Zahlung erfolgreich!",
        message: `Vielen Dank für Ihren Kauf. Sie erhalten in Kürze eine Bestätigungsemail.`,
        duration: 5000,
      });

      // Store order information
      const orderData = {
        orderId,
        email,
        fullName,
        courseTitle,
        price,
        tier,
        purchaseDate: new Date().toISOString(),
        courseAccessUrl: "/course",
      };
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
      localStorage.setItem(`userTier_${email}`, tier);
      localStorage.setItem(`userEmail`, email);

      if (onPaymentSuccess) {
        onPaymentSuccess(orderId);
      }

      // Redirect to course after 2 seconds
      setTimeout(() => {
        window.location.href = `/course?orderId=${orderId}`;
      }, 2000);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Zahlungsfehler",
        message:
          "Es gab ein Problem bei der Verarbeitung Ihrer Zahlung. Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierBenefits = () => {
    const benefits = {
      starter: [
        "5 Video-Module",
        "Workbooks & Templates",
        "Lebenslanger Zugriff",
      ],
      professional: [
        "Alle Starter-Inhalte",
        "Bonus: Fallstudien",
        "Community Forum",
      ],
      enterprise: [
        "Alle Professional-Inhalte",
        "1:1 Coaching Session",
        "Mehrplatz-Lizenz",
      ],
    };
    return benefits[tier];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Kurs buchen</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Summary */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">{courseTitle}</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-cyan-400">€{price}</span>
              <span className="text-gray-400">einmalig</span>
            </div>
            <div className="space-y-2">
              {getTierBenefits().map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <Check size={16} className="text-cyan-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={event => {
              event.preventDefault();
              handlePayPalPayment();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-white mb-2"
              >
                Vollständiger Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={event => setFullName(event.target.value)}
                placeholder="Max Mustermann"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-2"
              >
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="ihre@email.de"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isProcessing}
              />
            </div>

            {/* PayPal Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              style={{
                boxShadow: isProcessing
                  ? "none"
                  : "0 0 20px rgba(0, 217, 255, 0.3)",
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Wird verarbeitet...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 4.003-.028.15a.806.806 0 01-.795.68h-2.31a.568.568 0 01-.56-.65l1.195-7.58h.001c.06-.38.38-.66.77-.66h.5c2.57 0 4.576-.99 5.16-3.852.24-1.232.12-2.26-.48-2.958z" />
                  </svg>
                  <span>Mit PayPal zahlen</span>
                </>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="text-center text-xs text-gray-400">
            <p>🔒 Sichere Zahlung mit PayPal</p>
            <p>30 Tage Geld-zurück-Garantie</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
