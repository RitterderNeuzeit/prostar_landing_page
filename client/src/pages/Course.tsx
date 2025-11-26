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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-lg">Kurs wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!userTier) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container flex items-center justify-between h-16">
            <a
              href="/"
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </a>
            <h1 className="text-xl font-bold">KI-Prompting Kurs</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <div className="container py-12 text-center">
          <BookOpen size={64} className="mx-auto mb-6 text-gray-500" />
          <h2 className="text-3xl font-bold mb-4">Kein Kurszugriff</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sie haben noch keinen Kurs gekauft. Wählen Sie einen Kurs aus, um
            Zugriff auf alle Module zu erhalten.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-accent hover:bg-accent/90"
          >
            Zum Kurs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col items-center justify-center px-2 sm:px-4">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 px-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto mb-2 sm:mb-0">
            <a
              href="/"
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </a>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                KI-Prompting Kurs
              </h1>
              <p className="text-sm text-muted-foreground">
                Tier: {userTier.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCourse}
              className="gap-2"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareCourse}
              className="gap-2"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Teilen</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Order Confirmation Banner */}
      {orderData && (
        <div className="bg-green-900/20 border-b border-green-500/50 text-green-100 px-2 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <p className="font-semibold">✓ Zahlung erfolgreich!</p>
              <p className="text-sm opacity-90">
                Bestellnummer: {orderData.orderId} | Bestätigungsemail an{" "}
                {orderData.email}
              </p>
            </div>
            <BookOpen size={24} className="text-green-400 mt-2 sm:mt-0" />
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar - Module Navigation */}
          <aside className="lg:col-span-1 mb-4 lg:mb-0">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-2 sm:p-4">
              <CourseModulesPreview tier={userTier} userTier={userTier} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-card rounded-lg border border-border p-4 sm:p-8 prose prose-invert max-w-none">
              <h1 className="text-lg sm:text-2xl">
                Willkommen zum KI-Prompting Kurs!
              </h1>
              <p>
                Wählen Sie ein Modul aus der Seitenleiste, um zu beginnen. Alle
                Module sind für Ihren Tier verfügbar.
              </p>

              <h2 className="text-base sm:text-xl">
                Ihr Kurs-Tier: {userTier.toUpperCase()}
              </h2>
              <p>
                Sie haben Zugriff auf alle Module, die in Ihrem Tier enthalten
                sind. Nutzen Sie die Seitenleiste, um die Module zu erkunden.
              </p>

              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 sm:p-6 mt-4 sm:mt-8">
                <h3>💡 Tipp</h3>
                <p>
                  Klicken Sie auf ein Modul in der Seitenleiste, um den
                  vollständigen Inhalt zu sehen. Sie können Module auch
                  herunterladen und teilen.
                </p>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
