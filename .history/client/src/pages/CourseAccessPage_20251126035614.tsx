import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { trpcClient } from "@/lib/trpc";

type Step = "email" | "code" | "success";

export function CourseAccessPage() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  
  // Step 1: Email Input
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Step 2: Code Input
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  
  // Step 3: Success Data
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    courseName: string;
    expiresAt: Date;
  } | null>(null);

  // Auto-fill from URL params (wenn Email-Link geklickt)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const urlEmail = params.get("email");
    const urlKey = params.get("key");

    if (urlEmail) {
      setEmail(urlEmail);
      setCurrentStep("code");
    }
    if (urlKey) {
      setCode(urlKey);
    }
  }, [search]);

  // Auto-load latest registered email and send verification code
  useEffect(() => {
    const autoLoadEmail = async () => {
      try {
        console.log("🔍 Attempting to auto-load latest email...");
        
        // Versuche letzte Email vom Server zu holen
        const result = await trpcClient.course.getLatestEmail.query();
        
        if (result.success && result.email) {
          console.log("✅ Found latest email:", result.email);
          setEmail(result.email);
          
          // Automatisch Verifizierungs-Code versenden
          console.log("📧 Auto-sending verification code...");
          const codeResult = await trpcClient.course.sendVerificationCode.mutate({
            email: result.email,
          });
          
          if (codeResult.success) {
            console.log("✅ Code sent successfully!");
            // Zeige Info-Nachricht
            setEmailError("✅ Code wurde automatisch versendet! Bitte checke dein Email-Postfach 📬");
            
            // Nach 2s zur Code-Eingabe springen
            setTimeout(() => {
              setCurrentStep("code");
              setEmailError(null);
            }, 2000);
          } else {
            console.warn("⚠️ Auto-send failed:", codeResult.error);
          }
        } else {
          console.log("ℹ️ No recent email found, waiting for manual input");
        }
      } catch (err) {
        console.warn("ℹ️ Auto-load failed (expected on first visit):", err);
        // Kein Fehler anzeigen, nur warten auf manuelle Eingabe
      }
    };

    // Nur ausführen wenn noch auf Step "email" und keine Email eingegeben
    if (currentStep === "email" && !email) {
      const timer = setTimeout(() => {
        autoLoadEmail();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, email]);

  // Step 1: Email Verification
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!email || !email.includes("@")) {
      setEmailError("❌ Bitte gib eine gültige Email-Adresse ein");
      return;
    }

    setLoading(true);
    try {
      // Sende Email mit Verifizierungs-Code
      const result = await trpcClient.course.sendVerificationCode.mutate({
        email,
      });

      if (result.success) {
        setEmailError(null);
        setCurrentStep("code");
      } else {
        setEmailError(`❌ ${result.error || "Email-Versand fehlgeschlagen"}`);
      }
    } catch (err) {
      console.error("Email submission error:", err);
      setEmailError("❌ Fehler beim Email-Versand");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Code Verification
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);

    if (!code || code.length < 10) {
      setCodeError("❌ Bitte gib einen gültigen Code ein");
      return;
    }

    setLoading(true);
    try {
      const result = await trpcClient.course.verify.query({
        email,
        accessKey: code,
      });

      if (result.valid && result.name) {
        // ✅ Verifikation erfolgreich
        setUserData({
          name: result.name,
          email: result.email || email,
          courseName: result.courseName || "KI-Prompting Kurs",
          expiresAt: result.expiresAt ? new Date(result.expiresAt) : new Date(),
        });

        // 💾 Speichere Zugang in localStorage
        try {
          const userEmail = result.email || email;
          localStorage.setItem("userEmail", userEmail);
          localStorage.setItem(`userTier_${userEmail}`, "starter");
          localStorage.setItem("lastAccessKey", code);
          localStorage.setItem("lastAccessEmail", userEmail);
          localStorage.setItem("lastVerificationTime", new Date().toISOString());
        } catch (e) {
          console.warn("Could not persist to localStorage", e);
        }

        // 🎯 Navigiere nach 2 Sekunden zum Kurs
        setTimeout(() => {
          setCurrentStep("success");
          setTimeout(() => {
            setLocation("/course");
          }, 2000);
        }, 500);
      } else {
        setCodeError(`❌ ${result.error || "Code ist ungültig oder abgelaufen"}`);
      }
    } catch (err) {
      console.error("Code verification error:", err);
      setCodeError("❌ Verifikation fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  // 🔙 Zurück zur Email-Eingabe
  const handleBackToEmail = () => {
    setCurrentStep("email");
    setCode("");
    setCodeError(null);
  };

  // ==================== RENDERING ====================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* ========== STEP 1: EMAIL INPUT ========== */}
        {currentStep === "email" && (
          <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-10 text-white">
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h1 className="text-3xl font-black">Kurs-Zugang</h1>
                <p className="text-cyan-100 text-base mt-2 font-medium">
                  Schritt 1 von 3: Email-Adresse
                </p>
              </div>
            </div>

            <div className="p-10 space-y-6">
              <div className="mb-6">
                <p className="text-slate-200 text-center text-base font-medium">
                  Gib die Email-Adresse ein, mit der du dich registriert hast.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-base font-bold text-white mb-3">
                    Email-Adresse
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(null);
                    }}
                    placeholder="beispiel@prostarmarketing.de"
                    className="w-full px-5 py-4 border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 text-base font-medium"
                    required
                  />
                </div>

                {emailError && (
                  <div className="bg-red-500/30 border-l-4 border-red-400 p-5 rounded-lg">
                    <p className="text-red-100 text-base font-medium">{emailError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:bg-slate-600 text-white font-black py-4 px-4 rounded-xl transition transform hover:scale-105 disabled:hover:scale-100 text-lg"
                >
                  {loading ? "⏳ Versende Code..." : "✓ Code erhalten"}
                </button>

                <div className="text-center pt-6 border-t border-slate-600">
                  <a
                    href="/"
                    className="block text-cyan-300 hover:text-cyan-200 underline font-semibold text-base"
                  >
                    ← Zurück zur Startseite
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========== STEP 2: CODE INPUT ========== */}
        {currentStep === "code" && (
          <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-10 text-white">
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h1 className="text-3xl font-black">Kurs-Zugang</h1>
                <p className="text-cyan-100 text-base mt-2 font-medium">
                  Schritt 2 von 3: Verifizierungs-Code
                </p>
              </div>
            </div>

            <div className="p-10 space-y-6">
              <div className="mb-6">
                <p className="text-slate-200 text-center text-base mb-2 font-medium">
                  Email: <span className="font-bold text-cyan-300">{email}</span>
                </p>
                <p className="text-slate-300 text-center text-sm font-medium">
                  Wir haben einen Code an deine Email geschickt. Kopiere ihn hier ein.
                </p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <label className="block text-base font-bold text-white mb-3">
                    Verifizierungs-Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setCodeError(null);
                    }}
                    placeholder="z.B. VERIF_3E7F9A2B"
                    className="w-full px-5 py-4 border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 font-mono text-center text-base tracking-wider font-medium"
                    required
                  />
                  <p className="text-sm text-slate-400 mt-3 font-medium text-center">
                    (aus der Email kopieren und einfügen)
                  </p>
                </div>

                {codeError && (
                  <div className="bg-red-500/30 border-l-4 border-red-400 p-5 rounded-lg">
                    <p className="text-red-100 text-base font-medium">{codeError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length < 10}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:bg-slate-600 text-white font-black py-4 px-4 rounded-xl transition transform hover:scale-105 disabled:hover:scale-100 text-lg"
                >
                  {loading ? "⏳ Verifikation läuft..." : "✅ Code bestätigen"}
                </button>

                <div className="text-center space-y-3 pt-6 border-t border-slate-600">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="block w-full text-cyan-300 hover:text-cyan-200 underline text-base font-semibold"
                  >
                    ← Email ändern
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900/50 p-6 text-center text-sm text-slate-300 border-t border-slate-700">
              <p className="font-medium">
                Code nicht erhalten?{" "}
                <button
                  onClick={handleBackToEmail}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                >
                  Neue Email senden
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========== STEP 3: SUCCESS ========== */}
        {currentStep === "success" && userData && (
          <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
              </div>
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h1 className="text-5xl font-black mb-2 tracking-tight">Willkommen!</h1>
                <p className="text-cyan-100 text-lg font-medium">
                  Dein Kurszugang wurde verifiziert
                </p>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-4 border-cyan-400 p-8 rounded-xl">
                <h2 className="text-3xl font-black text-white mb-4">
                  Hallo {userData.name}! 👋
                </h2>
                <p className="text-slate-100 mb-4 text-lg leading-relaxed">
                  Herzlich willkommen zum Kurs{" "}
                  <span className="font-bold text-cyan-300">{userData.courseName}</span>!
                </p>
                <p className="text-slate-300 text-base">
                  📧 Angemeldet als: <span className="font-semibold text-cyan-300">{userData.email}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/20 p-8 rounded-xl border border-blue-400/50 backdrop-blur">
                  <h3 className="font-black text-white mb-3 text-lg">📚 Kurs</h3>
                  <p className="text-slate-100 text-base font-medium">{userData.courseName}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 p-8 rounded-xl border border-emerald-400/50 backdrop-blur">
                  <h3 className="font-black text-white mb-3 text-lg">⏰ Gültig bis</h3>
                  <p className="text-slate-100 text-base font-medium">
                    {userData.expiresAt.toLocaleDateString("de-DE", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/20 border border-amber-400/50 rounded-xl p-8 mb-8 backdrop-blur">
                <h3 className="font-black text-white mb-4 text-lg">ℹ️ Info</h3>
                <p className="text-slate-100 text-base font-medium">
                  Du wirst gleich zum Kurs weitergeleitet...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
