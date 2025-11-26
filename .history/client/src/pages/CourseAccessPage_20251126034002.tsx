import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { trpcClient } from "@/lib/trpc";

export function CourseAccessPage() {
  const search = useSearch();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    courseName: string;
    expiresAt: Date;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const handleVerify = async (emailInput: string, codeInput: string) => {
    if (!emailInput || !codeInput || codeInput.length < 10) {
      setError("❌ Bitte gib Email und vollständigen Code ein");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await trpcClient.course.verify.query({
        email: emailInput,
        accessKey: codeInput,
      });

      if (result.valid && result.name) {
        setVerified(true);
        setUserData({
          name: result.name,
          email: result.email || emailInput,
          courseName: result.courseName || "free-mini-course",
          expiresAt: result.expiresAt ? new Date(result.expiresAt) : new Date(),
        });
        // Persist minimal access info so the main /course page recognises the user
        try {
          const userEmail = result.email || emailInput;
          localStorage.setItem("userEmail", userEmail);
          localStorage.setItem(`userTier_${userEmail}`, "starter");
          try {
            localStorage.setItem("lastAccessKey", codeInput || "");
            localStorage.setItem("lastAccessEmail", userEmail);
          } catch (e) {
            console.warn("Could not persist last access info", e);
          }
        } catch (e) {
          console.warn("Could not persist access info to localStorage", e);
        }
      } else {
        setError(`❌ ${result.error || "Ungültiger Code oder Email"}`);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("❌ Verifizierung fehlgeschlagen - bitte versuche es später");
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify wenn Key und Email in URL
  useEffect(() => {
    const params = new URLSearchParams(search);
    const accessKey = params.get("key");
    const emailParam = params.get("email");

    if (accessKey && emailParam) {
      handleVerify(emailParam, accessKey);
      return;
    }

    // If accessKey exists but no email param, prompt user for their email
    if (accessKey && !emailParam) {
      setManualCode(accessKey);
      setEmail("");
      setEmailSubmitted(true);
      // show a small modal to ask for email if none provided
      setTimeout(() => setShowEmailPrompt(true), 250);
    }
  }, [search]);

  // Loading State
  if (loading && !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-cyan-400 mx-auto mb-6"></div>
          <p className="text-cyan-100 text-lg font-bold">Dein Zugang wird verifiziert...</p>
        </div>
      </div>
    );
  }

  // Success - Kurszugang Seite
  if (verified && userData) {
    const expiryDate = userData.expiresAt.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
              </div>
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h1 className="text-5xl font-black mb-2 tracking-tight">Willkommen!</h1>
                <p className="text-cyan-100 text-lg font-medium">Dein Kurszugang ist aktiv</p>
              </div>
            </div>

            {/* Content */}
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
                {/* Kurs Info */}
                <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/20 p-8 rounded-xl border border-blue-400/50 backdrop-blur">
                  <h3 className="font-black text-white mb-3 text-lg">📚 Dein Kurs</h3>
                  <p className="text-slate-100 text-base font-medium">{userData.courseName}</p>
                </div>

                {/* Gültig bis */}
                <div className="bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 p-8 rounded-xl border border-emerald-400/50 backdrop-blur">
                  <h3 className="font-black text-white mb-3 text-lg">⏰ Gültig bis</h3>
                  <p className="text-slate-100 text-base font-medium">{expiryDate}</p>
                </div>
              </div>

              {/* Wichtige Infos */}
              <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/20 border border-amber-400/50 rounded-xl p-8 mb-8 backdrop-blur">
                <h3 className="font-black text-white mb-4 text-lg">ℹ️ Wichtige Informationen</h3>
                <ul className="space-y-3 text-sm text-slate-100 font-medium">
                  <li className="flex items-center gap-3"><span className="text-emerald-400 font-black">✓</span> Dein Zugang ist jetzt aktiv</li>
                  <li className="flex items-center gap-3"><span className="text-emerald-400 font-black">✓</span> Du kannst den Kurs jederzeit abrufen</li>
                  <li className="flex items-center gap-3"><span className="text-emerald-400 font-black">✓</span> Der Zugang ist 90 Tage gültig</li>
                  <li className="flex items-center gap-3"><span className="text-emerald-400 font-black">✓</span> Speichere diese Seite als Lesezeichen</li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-4">
                <a
                  href="/course"
                  className="w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black py-4 px-6 rounded-xl transition transform hover:scale-105 shadow-lg text-lg"
                >
                  🎬 Zum Kurs
                </a>
                <a
                  href="/"
                  className="w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition border border-slate-600 text-lg"
                >
                  ← Zurück zur Startseite
                </a>
              </div>

              {/* Footer */}
              <div className="bg-slate-900/50 p-8 text-center text-sm text-slate-300 border-t border-slate-700">
                <p className="font-medium">
                  Fragen? Kontaktiere uns unter{" "}
                  <a
                    href="mailto:support@prostarmarketing.de"
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                  >
                    support@prostarmarketing.de
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email input form (step 1)
  if (!emailSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-10 text-white">
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h1 className="text-3xl font-black">Kurs Zugang</h1>
                <p className="text-cyan-100 text-base mt-2 font-medium">
                  Schritt 1: Email-Adresse
                </p>
              </div>
            </div>

            <div className="p-10 space-y-6">
              <div className="mb-6">
                <p className="text-slate-200 text-center text-base font-medium">
                  Gib die Email-Adresse ein, mit der du dich angemeldet hast.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-base font-bold text-white mb-3">
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e =>
                      e.key === "Enter" && email && setEmailSubmitted(true)
                    }
                    placeholder="z.B. info@prostarmarketing.de"
                    className="w-full px-5 py-4 border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 text-base font-medium"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/30 border-l-4 border-red-400 p-5 rounded-lg">
                    <p className="text-red-100 text-base font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={() => email && setEmailSubmitted(true)}
                  disabled={!email}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:bg-slate-600 text-white font-black py-4 px-4 rounded-xl transition transform hover:scale-105 disabled:hover:scale-100 text-lg"
                >
                  ✓ Email bestätigen
                </button>

                <div className="text-center pt-6 border-t border-slate-600">
                  <a
                    href="/"
                    className="block text-cyan-300 hover:text-cyan-200 underline font-semibold text-base"
                  >
                    ← Zurück zur Startseite
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Code input form (step 2)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 p-4 flex items-center justify-center">
      {showEmailPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl p-8 w-full max-w-sm mx-4 border border-cyan-500/30">
            <h3 className="text-2xl font-black text-white mb-4">
              Email zur Verifikation
            </h3>
            <p className="text-base text-slate-300 mb-6 font-medium">
              Bitte gib die Email-Adresse ein, mit der du dich angemeldet hast,
              damit der Code zugeordnet werden kann.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine.email@beispiel.de"
              className="w-full px-5 py-3 border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg mb-6 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 font-medium"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (email && manualCode) {
                    setShowEmailPrompt(false);
                    handleVerify(email, manualCode);
                  }
                }}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold"
              >
                Code verifizieren
              </button>
              <button
                onClick={() => setShowEmailPrompt(false)}
                className="flex-1 border-2 border-slate-600 hover:border-slate-500 text-white py-3 rounded-lg font-bold"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto w-full">
        <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-10 text-white">
            <div className="text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-3xl font-black">Kurs Zugang</h1>
              <p className="text-cyan-100 text-base mt-2 font-medium">
                Schritt 2: Code eingeben
              </p>
            </div>
          </div>

          <div className="p-10 space-y-6">
            <div className="mb-6">
              <p className="text-slate-200 text-center text-base mb-3 font-medium">
                Email: <span className="font-bold text-cyan-300">{email}</span>
              </p>
              <p className="text-slate-300 text-center text-base font-medium">
                Gib den Code aus der Email ein.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-bold text-white mb-3">
                  Zugriffscode
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && handleVerify(email, manualCode)
                  }
                  placeholder="z.B. testuser_7384704aaf744e73"
                  className="w-full px-5 py-4 border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 font-mono text-center text-base tracking-wider font-medium"
                />
                <p className="text-sm text-slate-400 mt-3 font-medium">
                  (aus der Email kopieren)
                </p>
              </div>

              {error && (
                <div className="bg-red-500/30 border-l-4 border-red-400 p-5 rounded-lg">
                  <p className="text-red-100 text-base font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={() => handleVerify(email, manualCode)}
                disabled={loading || manualCode.length < 10}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:bg-slate-600 text-white font-black py-4 px-4 rounded-xl transition transform hover:scale-105 disabled:hover:scale-100 text-lg"
              >
                {loading ? "⏳ Verifizieren..." : "✅ Code Bestätigen"}
              </button>

              <div className="text-center space-y-3 pt-6 border-t border-slate-600">
                <button
                  onClick={() => {
                    setEmailSubmitted(false);
                    setError(null);
                  }}
                  className="block w-full text-cyan-300 hover:text-cyan-200 underline text-base font-semibold"
                >
                  ← Email ändern
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 text-center text-sm text-slate-300 border-t border-slate-700 mt-8">
              <p className="font-medium">
                Fragen?{" "}
                <a
                  href="mailto:support@prostarmarketing.de"
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                >
                  support@prostarmarketing.de
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
