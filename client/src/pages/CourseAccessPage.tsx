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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Dein Zugang wird verifiziert...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 text-white">
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold mb-2">Willkommen!</h1>
                <p className="text-cyan-100">Dein Zugang ist aktiv</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Hallo {userData.name}! 👋
                </h2>
                <p className="text-gray-700 mb-4">
                  Herzlich willkommen zum Kurs{" "}
                  <strong>{userData.courseName}</strong>!
                </p>
                <p className="text-gray-600 text-sm">
                  📧 Angemeldet als: <strong>{userData.email}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Kurs Info */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-2">📚 Dein Kurs</h3>
                  <p className="text-gray-600">{userData.courseName}</p>
                </div>

                {/* Gültig bis */}
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-bold text-gray-800 mb-2">
                    ⏰ Gültig bis
                  </h3>
                  <p className="text-gray-600">{expiryDate}</p>
                </div>
              </div>

              {/* Wichtige Infos */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-yellow-800 mb-3">
                  ℹ️ Wichtige Informationen
                </h3>
                <ul className="space-y-2 text-sm text-yellow-900">
                  <li>✓ Dein Zugang ist jetzt aktiv</li>
                  <li>✓ Du kannst den Kurs jederzeit abrufen</li>
                  <li>✓ Der Zugang ist 90 Tage gültig</li>
                  <li>✓ Speichere diese Seite als Lesezeichen</li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href="/course"
                  className="w-full text-center bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-md transition"
                >
                  🎬 Zum Kurs
                </a>
                <a
                  href="/"
                  className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition"
                >
                  ← Zurück zur Startseite
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 text-center text-sm text-gray-600 border-t">
              <p>
                Fragen? Kontaktiere uns unter{" "}
                <a
                  href="mailto:support@prostarmarketing.de"
                  className="text-cyan-500 hover:underline"
                >
                  support@prostarmarketing.de
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email input form (step 1)
  if (!emailSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 text-white">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h1 className="text-2xl font-bold">Kurs Zugang</h1>
                <p className="text-cyan-100 text-sm mt-1">
                  Schritt 1: Email-Adresse
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <p className="text-gray-600 text-center text-sm mb-4">
                  Gib die Email-Adresse ein, mit der du dich angemeldet hast.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={() => email && setEmailSubmitted(true)}
                  disabled={!email}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  ✓ Email bestätigen
                </button>

                <div className="text-center pt-4 border-t">
                  <a
                    href="/"
                    className="block text-cyan-500 hover:underline text-sm font-medium"
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
  // If we need the user to enter email for a provided key, show modal
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4 flex items-center justify-center">
      {showEmailPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-3">
              Email zur Verifikation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Bitte gib die Email-Adresse ein, mit der du dich angemeldet hast,
              damit der Code zugeordnet werden kann.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine.email@beispiel.de"
              className="w-full px-3 py-2 border rounded mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (email && manualCode) {
                    setShowEmailPrompt(false);
                    handleVerify(email, manualCode);
                  }
                }}
                className="flex-1 bg-cyan-500 text-white py-2 rounded"
              >
                Code verifizieren
              </button>
              <button
                onClick={() => setShowEmailPrompt(false)}
                className="flex-1 border py-2 rounded"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 text-white">
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h1 className="text-2xl font-bold">Kurs Zugang</h1>
              <p className="text-cyan-100 text-sm mt-1">
                Schritt 2: Code eingeben
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <p className="text-gray-600 text-center text-sm mb-2">
                Email: <strong>{email}</strong>
              </p>
              <p className="text-gray-600 text-center text-sm">
                Gib den Code aus der Email ein.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 font-mono text-center text-sm tracking-wider"
                />
                <p className="text-xs text-gray-500 mt-2">
                  (aus der Email kopieren)
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={() => handleVerify(email, manualCode)}
                disabled={loading || manualCode.length < 10}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? "⏳ Verifizieren..." : "✅ Code Bestätigen"}
              </button>

              <div className="text-center space-y-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setEmailSubmitted(false);
                    setError(null);
                  }}
                  className="block w-full text-cyan-500 hover:underline text-sm font-medium"
                >
                  ← Email ändern
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 text-center text-xs text-gray-600 border-t">
            <p>
              Fragen?{" "}
              <a
                href="mailto:support@prostarmarketing.de"
                className="text-cyan-500 hover:underline"
              >
                support@prostarmarketing.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
