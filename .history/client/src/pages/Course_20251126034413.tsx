import React, { useState, useEffect } from "react";
import { trpcClient } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Share2, BookOpen } from "lucide-react";
import { Streamdown } from "streamdown";
import { useNotification } from "@/contexts/NotificationContext";
import CourseModulesPreview from "@/components/CourseModulesPreview";

interface OrderData {
  orderId: string;
  email: string;
  fullName: string;
  courseTitle: string;
  price: number;
  tier: string;
  purchaseDate: string;
  courseAccessUrl: string;
}

export default function Course() {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [userTier, setUserTier] = useState<
    "starter" | "professional" | "enterprise" | null
  >(null);

  useEffect(() => {
    let mounted = true;
    async function tryVerifyFromQuery() {
      try {
        const params = new URLSearchParams(window.location.search);
        const key = params.get("key");
        const emailParam = params.get("email");
        if (key && emailParam) {
          // call verify endpoint to ensure access is registered
          try {
            const result = await trpcClient.course.verify.query({
              email: emailParam,
              accessKey: key,
            });
            if (result.valid) {
              // persist minimal info for course access
              try {
                localStorage.setItem("userEmail", result.email || emailParam);
                localStorage.setItem(
                  `userTier_${result.email || emailParam}`,
                  "starter"
                );
                localStorage.setItem("lastAccessKey", key);
                localStorage.setItem(
                  "lastAccessEmail",
                  result.email || emailParam
                );
              } catch (e) {
                console.warn("Could not persist access info from query", e);
              }
              // reflect in UI
              if (mounted) setUserTier("starter");
              // remove query params from URL to keep it clean
              const url = new URL(window.location.href);
              url.searchParams.delete("key");
              url.searchParams.delete("email");
              window.history.replaceState({}, document.title, url.toString());
            }
          } catch (err) {
            console.warn("Query verify failed", err);
          }
        }
      } catch (err) {
        console.warn("Failed to parse query for verification", err);
      }
    }
    tryVerifyFromQuery();
    // Check for order data in localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    const userEmail = localStorage.getItem("userEmail");

    if (orderId) {
      const storedOrder = localStorage.getItem(`order_${orderId}`);
      if (storedOrder) {
        try {
          const order = JSON.parse(storedOrder);
          setOrderData(order);
          setUserTier(order.tier as "starter" | "professional" | "enterprise");
        } catch (error) {
          console.error("Failed to parse order data:", error);
        }
      }
    } else if (userEmail) {
      // Check if user has purchased before
      let tier = localStorage.getItem(`userTier_${userEmail}`);
      if (
        tier === "starter" ||
        tier === "professional" ||
        tier === "enterprise"
      ) {
        setUserTier(tier as any);
      } else {
        // Fallback: check recently stored accessKey/email from the access flow
        const lastKey = localStorage.getItem("lastAccessKey");
        const lastEmail = localStorage.getItem("lastAccessEmail");
        if (lastKey && lastEmail && lastEmail === userEmail) {
          // grant starter access for the mini-course when recent access key exists
          setUserTier("starter");
          // persist the tier for future visits
          try {
            localStorage.setItem(`userTier_${userEmail}`, "starter");
          } catch (e) {
            console.warn("Could not persist user tier", e);
          }
        }
      }
    }

    setIsLoading(false);
    return () => {
      mounted = false;
    };
  }, []);

  const handleDownloadCourse = () => {
    addNotification({
      type: "info",
      title: "Download",
      message: "Laden Sie Module einzeln herunter, indem Sie sie öffnen.",
    });
  };

  const handleShareCourse = () => {
    if (navigator.share) {
      navigator.share({
        title: "KI-Prompting Kurs",
        text: "Schau dir diesen großartigen KI-Kurs an!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification({
        type: "success",
        title: "Link kopiert",
        message: "Der Kurs-Link wurde in die Zwischenablage kopiert.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-cyan-400 mb-4"></div>
          <p className="text-cyan-100 text-lg font-bold">Kurs wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!userTier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-cyan-500/30">
          <div className="flex items-center justify-between h-16 px-4 container mx-auto">
            <a
              href="/"
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors font-bold text-lg"
            >
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </a>
            <h1 className="text-2xl font-black text-white">KI-Prompting Kurs</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <div className="container mx-auto py-20 text-center px-4">
          <div className="mb-8 text-6xl animate-bounce">📚</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Kein Kurszugriff
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto text-lg font-medium leading-relaxed">
            Sie haben noch keinen Kurs gekauft. Wählen Sie einen Kurs aus, um
            Zugriff auf alle Module zu erhalten.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black py-4 px-8 rounded-xl transition transform hover:scale-105"
          >
            Zum Kurs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-cyan-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 px-4 sm:px-6 py-3 sm:py-0 container mx-auto gap-4 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <a
              href="/"
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors font-bold text-lg"
            >
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </a>
            <div>
              <h1 className="text-2xl font-black text-white">
                KI-Prompting Kurs
              </h1>
              <p className="text-sm text-cyan-200 font-bold">
                Tier: {userTier.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadCourse}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold transition text-sm"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handleShareCourse}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold transition text-sm"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Teilen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Order Confirmation Banner */}
      {orderData && (
        <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 border-b border-emerald-500/50 text-emerald-100 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between container mx-auto gap-3">
            <div>
              <p className="font-black text-lg">✓ Zahlung erfolgreich!</p>
              <p className="text-sm opacity-90 font-medium">
                Bestellnummer: {orderData.orderId} | Bestätigungsemail an{" "}
                {orderData.email}
              </p>
            </div>
            <BookOpen size={28} className="text-emerald-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col container mx-auto w-full max-w-6xl py-6 sm:py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar - Module Navigation */}
          <aside className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="sticky top-24 bg-slate-800/80 rounded-xl border border-cyan-500/30 p-4 sm:p-6 backdrop-blur">
              <CourseModulesPreview tier={userTier} userTier={userTier} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-slate-800/80 rounded-xl border border-cyan-500/30 p-6 sm:p-8 backdrop-blur">
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Willkommen zum KI-Prompting Kurs! 🎓
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-lg text-slate-100 font-medium leading-relaxed">
                  Wählen Sie ein Modul aus der Seitenleiste, um zu beginnen. Alle
                  Module sind für Ihren Tier verfügbar.
                </p>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-4 border-cyan-400 p-6 sm:p-8 rounded-lg">
                  <h2 className="text-2xl font-black text-white mb-3">
                    🎯 Ihr Kurs-Tier: {userTier.toUpperCase()}
                  </h2>
                  <p className="text-base text-slate-100 font-medium leading-relaxed">
                    Sie haben Zugriff auf alle Module, die in Ihrem Tier enthalten
                    sind. Nutzen Sie die Seitenleiste, um die Module zu erkunden.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-l-4 border-blue-400 p-6 sm:p-8 rounded-lg">
                  <h3 className="text-xl font-black text-white mb-3">💡 Tipp</h3>
                  <p className="text-base text-slate-100 font-medium leading-relaxed">
                    Klicken Sie auf ein Modul in der Seitenleiste, um den
                    vollständigen Inhalt zu sehen. Sie können Module auch
                    herunterladen und teilen.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-l-4 border-emerald-400 p-6 sm:p-8 rounded-lg">
                  <h3 className="text-xl font-black text-white mb-3">⭐ Premium Features</h3>
                  <ul className="space-y-3 text-base text-slate-100 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black text-lg">✓</span>
                      <span>Unbegrenzter Zugriff auf alle Kursinhalte</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black text-lg">✓</span>
                      <span>Herunterbare Ressourcen und Materialien</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black text-lg">✓</span>
                      <span>Lifetime-Zugriff auf zukünftige Updates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black text-lg">✓</span>
                      <span>Persönliche Unterstützung vom Team</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-10 pt-8 border-t border-slate-700">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black py-4 px-6 rounded-xl transition transform hover:scale-105 text-lg"
                >
                  📚 Module durchstöbern
                </button>
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/95 border-t border-slate-700 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-slate-300 font-medium">
          <p>
            © 2025 ProStar Marketing | Fragen?{" "}
            <a
              href="mailto:support@prostarmarketing.de"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline"
            >
              support@prostarmarketing.de
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
