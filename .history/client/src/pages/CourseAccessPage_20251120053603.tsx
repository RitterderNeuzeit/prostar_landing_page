import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { trpcClient } from "@/lib/trpc";

export function CourseAccessPage() {
  const search = useSearch();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    courseName: string;
    expiresAt: Date;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      const params = new URLSearchParams(search);
      const accessKey = params.get("key");

      if (!accessKey) {
        setError("❌ Kein Zugriffsschlüssel gefunden");
        setLoading(false);
        return;
      }

      try {
        const result = await trpcClient.course.verify.query({ accessKey });

        if (result.valid && result.name) {
          setVerified(true);
          setUserData({
            name: result.name,
            email: result.email || "",
            courseName: result.courseName || "free-mini-course",
            expiresAt: result.expiresAt ? new Date(result.expiresAt) : new Date(),
          });
        } else {
          setError(`❌ ${result.error || "Ungültiger Zugriffsschlüssel"}`);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("❌ Verifizierung fehlgeschlagen");
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Dein Zugang wird verifiziert...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">Zugang abgelehnt</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-md transition"
            >
              ← Zurück zur Startseite
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!verified || !userData) {
    return null;
  }

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
                Herzlich willkommen zum Kurs <strong>{userData.courseName}</strong>!
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
                <h3 className="font-bold text-gray-800 mb-2">⏰ Gültig bis</h3>
                <p className="text-gray-600">{expiryDate}</p>
              </div>
            </div>

            {/* Wichtige Infos */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-yellow-800 mb-3">ℹ️ Wichtige Informationen</h3>
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
              <a href="mailto:support@prostarmarketing.de" className="text-cyan-500 hover:underline">
                support@prostarmarketing.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
