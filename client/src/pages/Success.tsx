import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Success() {
  const [location] = useLocation();
  const [sessionId, setSessionId] = useState("");
  const [tier, setTier] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    // Extract query parameters
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    const t = params.get("tier");

    if (sid) {
      setSessionId(sid);
      setTier(t || "");

      // Fetch session details
      fetch(`/api/checkout/session/${sid}`)
        .then(res => res.json())
        .then(data => {
          setSessionData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch session:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const getTierInfo = (tierName: string) => {
    const tiers: Record<
      string,
      { name: string; modules: number; color: string }
    > = {
      starter: {
        name: "Starter",
        modules: 3,
        color: "from-cyan-500 to-blue-500",
      },
      professional: {
        name: "Professional",
        modules: 8,
        color: "from-cyan-400 to-teal-500",
      },
      enterprise: {
        name: "Enterprise",
        modules: 9,
        color: "from-cyan-300 to-green-500",
      },
    };
    return tiers[tierName] || tiers.starter;
  };

  const tierInfo = getTierInfo(tier);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27] text-white py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
              <CheckCircle className="w-20 h-20 text-cyan-400 relative z-10" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Zahlungserfolg! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Willkommen zum KI-Prompting Kurs
          </p>
          <p className="text-gray-400">
            Ihre Bestellung wurde erfolgreich verarbeitet
          </p>
        </div>

        {/* Order Details Card */}
        {sessionData && (
          <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1535] border border-cyan-500/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">
              Bestelldetails
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20">
                <span className="text-gray-300">Paket:</span>
                <span className="text-xl font-bold text-cyan-400">
                  {tierInfo.name} Tier
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20">
                <span className="text-gray-300">Module:</span>
                <span className="text-lg font-semibold text-cyan-300">
                  {tierInfo.modules} Module
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20">
                <span className="text-gray-300">Betrag:</span>
                <span className="text-2xl font-bold text-cyan-400">
                  {sessionData.amount_total
                    ? `€${(sessionData.amount_total / 100).toFixed(2)}`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Bestellnummer:</span>
                <span className="text-sm font-mono text-gray-400">
                  {sessionId?.substring(0, 20)}...
                </span>
              </div>
            </div>

            {sessionData.customer_email && (
              <p className="text-sm text-gray-400 text-center">
                Bestätigung wurde an{" "}
                <strong>{sessionData.customer_email}</strong> gesendet
              </p>
            )}
          </div>
        )}

        {/* What's Next */}
        <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1535] border border-cyan-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">
            Nächste Schritte
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                  <span className="text-cyan-400 font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Kurszugang aktivieren
                </h3>
                <p className="text-gray-400 text-sm">
                  Ihr Kurszugang wurde sofort aktiviert. Sie können jetzt auf
                  alle {tierInfo.modules} Module zugreifen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                  <span className="text-cyan-400 font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Willkommens-E-Mail
                </h3>
                <p className="text-gray-400 text-sm">
                  Überprüfen Sie Ihr E-Mail-Postfach (auch Spam-Ordner) für die
                  Willkommens-E-Mail mit allen Kursmaterialien.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                  <span className="text-cyan-400 font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Mit Modul 1 starten
                </h3>
                <p className="text-gray-400 text-sm">
                  Beginnen Sie mit Modul 1 und folgen Sie dem strukturierten
                  Lernpfad. Alle Module sind lebenslang verfügbar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => (window.location.href = "/course")}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/50"
          >
            <ArrowRight className="w-5 h-5" />
            Zum Kurs
          </Button>

          <Button
            onClick={() => {
              const element = document.createElement("a");
              element.href = "/course-materials.pdf";
              element.download = "KI-Prompting-Kurs-Materialien.pdf";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Materialien
          </Button>

          <Button
            onClick={() => {
              const text = `Ich habe gerade den KI-Prompting Kurs (${tierInfo.name} Tier) abgeschlossen! 🚀 Empfehle ich jedem, der seine KI-Fähigkeiten verbessern möchte.`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Teilen
          </Button>
        </div>

        {/* Support */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">
            Haben Sie Fragen oder Probleme beim Zugriff?
          </p>
          <Button
            onClick={() => {
              // Open live chat
              const chatWidget = document.querySelector("[data-chat-widget]");
              if (chatWidget) {
                chatWidget.dispatchEvent(new Event("open"));
              }
            }}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Live Chat starten
          </Button>
        </div>
      </div>
    </div>
  );
}
