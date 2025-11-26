import React, { useState, useEffect } from "react";
import { trpcClient } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronLeft, Download, Share2, BookOpen, Database } from "lucide-react";
import CourseModulesPreview from "@/components/CourseModulesPreview";

interface CourseData {
  userEmail: string;
  userTier: "starter" | "professional" | "enterprise";
  verificationTime: string;
  accessKey: string;
}

export default function Course() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userTier, setUserTier] = useState<"starter" | "professional" | "enterprise" | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showDataInfo, setShowDataInfo] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCourseAccess = async () => {
      try {
        // Auto-verify from URL params
        const params = new URLSearchParams(window.location.search);
        const key = params.get("key");
        const emailParam = params.get("email");

        if (key && emailParam && mounted) {
          try {
            const result = await trpcClient.course.verify.query({
              email: emailParam,
              accessKey: key,
            });

            if (result.valid && mounted) {
              const userEmail = result.email || emailParam;
              localStorage.setItem("userEmail", userEmail);
              localStorage.setItem(`userTier_${userEmail}`, "starter");
              localStorage.setItem("lastAccessKey", key);
              localStorage.setItem("lastAccessEmail", userEmail);
              localStorage.setItem("lastVerificationTime", new Date().toISOString());

              setUserTier("starter");

              // Clean URL
              const url = new URL(window.location.href);
              url.searchParams.delete("key");
              url.searchParams.delete("email");
              window.history.replaceState({}, document.title, url.toString());
            }
          } catch (err) {
            console.warn("Query verify failed", err);
          }
        }

        // Load from localStorage
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail && mounted) {
          const tier = localStorage.getItem(`userTier_${userEmail}`);
          const accessKey = localStorage.getItem("lastAccessKey");
          const verificationTime = localStorage.getItem("lastVerificationTime");

          if (tier === "starter" || tier === "professional" || tier === "enterprise") {
            setUserTier(tier);
            setCourseData({
              userEmail,
              userTier: tier as any,
              verificationTime: verificationTime || new Date().toISOString(),
              accessKey: accessKey || "",
            });
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Load course error:", err);
        setIsLoading(false);
      }
    };

    loadCourseAccess();
    return () => {
      mounted = false;
    };
  }, []);

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

  if (!userTier || !courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800">
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-cyan-500/30">
          <div className="flex items-center justify-between h-16 px-6 container mx-auto">
            <a
              href="/"
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-bold"
            >
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </a>
            <h1 className="text-2xl font-black text-white">KI-Prompting Kurs</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <div className="container mx-auto py-20 text-center px-4">
          <div className="mb-8 text-6xl animate-bounce">🔒</div>
          <h2 className="text-4xl font-black text-white mb-4">Kein Kurszugriff</h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto text-lg font-medium">
            Du hast noch keinen Kurs-Zugang. Bitte registriere dich zuerst.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black py-4 px-8 rounded-xl transition transform hover:scale-105"
          >
            Zur Registrierung
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-800 flex flex-col">
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-cyan-500/30 shadow-lg">
        <div className="flex items-center justify-between h-16 px-6 container mx-auto gap-4">
          <a
            href="/"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-bold text-lg transition"
          >
            <ChevronLeft size={20} />
            <span>Zurück</span>
          </a>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">KI-Prompting Kurs</h1>
            <p className="text-sm text-cyan-200 font-bold">Tier: {userTier.toUpperCase()}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDataInfo(!showDataInfo)}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-300 transition"
              title="Zeige Daten-Speicherung"
            >
              <Database size={20} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("✅ Kurs-Link kopiert!");
              }}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-300 transition"
              title="Link teilen"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ========== DATA INFO PANEL ========== */}
      {showDataInfo && (
        <div className="bg-slate-900/90 border-b border-cyan-500/30 p-6">
          <div className="container mx-auto">
            <h3 className="text-xl font-black text-white mb-4">💾 Daten-Speicherung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Browser localStorage */}
              <div className="bg-slate-800/80 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-lg font-black text-blue-300 mb-3">🌐 Browser (localStorage)</h4>
                <div className="space-y-2 text-sm text-slate-200 font-mono">
                  <p><span className="text-cyan-400">userEmail:</span> {courseData.userEmail}</p>
                  <p><span className="text-cyan-400">userTier:</span> {courseData.userTier}</p>
                  <p><span className="text-cyan-400">lastAccessKey:</span> {courseData.accessKey.substring(0, 20)}...</p>
                  <p><span className="text-cyan-400">lastVerificationTime:</span></p>
                  <p className="text-xs text-slate-400">{courseData.verificationTime}</p>
                </div>
              </div>

              {/* Server Database */}
              <div className="bg-slate-800/80 rounded-lg p-4 border border-emerald-500/30">
                <h4 className="text-lg font-black text-emerald-300 mb-3">🗄️ Server (MySQL DB)</h4>
                <div className="space-y-2 text-sm text-slate-200 font-mono">
                  <p><span className="text-cyan-400">Table:</span> courseRegistrations</p>
                  <p><span className="text-cyan-400">accessKey:</span> {courseData.accessKey.substring(0, 20)}...</p>
                  <p><span className="text-cyan-400">email:</span> {courseData.userEmail}</p>
                  <p><span className="text-cyan-400">status:</span> active</p>
                  <p><span className="text-cyan-400">expiresAt:</span> +90 Tage</p>
                </div>
              </div>

              {/* Session Cache */}
              <div className="bg-slate-800/80 rounded-lg p-4 border border-amber-500/30">
                <h4 className="text-lg font-black text-amber-300 mb-3">⚡ Fallback (Cache)</h4>
                <div className="space-y-2 text-sm text-slate-200 font-mono">
                  <p><span className="text-cyan-400">registrationCache:</span> In-Memory</p>
                  <p><span className="text-cyan-400">Nutzen:</span> Wenn DB offline</p>
                  <p><span className="text-cyan-400">TTL:</span> Session-Duration</p>
                  <p className="text-xs text-slate-400 mt-3">
                    ✅ Automatische Fallback wenn DB nicht erreichbar
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-cyan-500/20 border-l-4 border-cyan-400 p-4 rounded-lg">
              <p className="text-cyan-100 text-sm font-medium">
                <span className="font-black">📍 Daten-Fluss:</span> Email-Eingabe → Code-Verifizierung → localStorage Speicherung → Server DB (MySQL) → Kurs-Zugriff
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 container mx-auto w-full max-w-7xl py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ========== SIDEBAR: Module Navigation ========== */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-800/80 rounded-xl border border-cyan-500/30 p-6 backdrop-blur max-h-[calc(100vh-150px)] overflow-y-auto">
              <h3 className="text-lg font-black text-white mb-4">📚 Module</h3>
              <CourseModulesPreview tier={userTier} userTier={userTier} />
            </div>
          </aside>

          {/* ========== MAIN CONTENT AREA ========== */}
          <main className="lg:col-span-3 space-y-8">
            {/* Welcome Card */}
            <div className="bg-slate-800/80 rounded-xl border border-cyan-500/30 p-10 backdrop-blur">
              <div className="flex items-start gap-6 mb-8">
                <div className="text-6xl flex-shrink-0">🎓</div>
                <div>
                  <h1 className="text-5xl font-black text-white mb-3">
                    Willkommen zum KI-Prompting Kurs!
                  </h1>
                  <p className="text-xl text-cyan-200 font-bold">
                    Dein persönlicher Lernbereich für fortgeschrittene KI-Prompting Techniken
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-lg text-slate-100 font-medium leading-relaxed">
                  Wähle ein Modul aus der Seitenleiste, um zu beginnen. Alle Module sind für dein Tier verfügbar und können jederzeit offline heruntergeladen werden.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-l-4 border-cyan-400 p-6 rounded-lg">
                    <h3 className="text-2xl font-black text-white mb-3">🎯 Dein Tier</h3>
                    <p className="text-slate-100 text-base font-medium">
                      <span className="text-cyan-300 font-black text-lg">{userTier.toUpperCase()}</span>
                    </p>
                    <p className="text-slate-300 text-sm mt-3 font-medium">
                      ✅ Vollen Zugriff auf alle Inhalte dieses Tiers
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-l-4 border-emerald-400 p-6 rounded-lg">
                    <h3 className="text-2xl font-black text-white mb-3">⏰ Gültig bis</h3>
                    <p className="text-slate-100 text-base font-medium">
                      {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("de-DE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-slate-300 text-sm mt-3 font-medium">
                      ✅ Lifetime-Zugriff auch nach Ablauf
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-l-4 border-amber-400 p-6 rounded-lg">
                  <h3 className="text-2xl font-black text-white mb-3">💡 Tipps zum Start</h3>
                  <ul className="space-y-3 text-base text-slate-100 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black">✓</span>
                      <span>Öffne ein Modul aus der Seitenleiste</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black">✓</span>
                      <span>Lerne in deinem eigenen Tempo</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black">✓</span>
                      <span>Module können heruntergeladen werden</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-emerald-400 font-black">✓</span>
                      <span>Speichere dein Fortschritt automatisch</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-l-4 border-blue-400 p-6 rounded-lg">
                  <h3 className="text-2xl font-black text-white mb-3">⭐ Premium Features</h3>
                  <ul className="space-y-3 text-base text-slate-100 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="text-blue-400 font-black">★</span>
                      <span>Unbegrenzter Zugriff auf alle Kursinhalte</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-blue-400 font-black">★</span>
                      <span>Herunterbare Ressourcen und Materialien</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-blue-400 font-black">★</span>
                      <span>Lifetime-Zugriff auf zukünftige Updates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-blue-400 font-black">★</span>
                      <span>Persönliche Email-Unterstützung</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-700 flex gap-4">
                <a
                  href="/#modules"
                  className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black py-4 px-6 rounded-xl transition transform hover:scale-105 text-lg"
                >
                  📚 Module durchstöbern
                </a>
                <button
                  onClick={() => {
                    const courseName = courseData.userEmail;
                    const email = courseData.userEmail;
                    const tier = courseData.userTier;
                    const link = `${window.location.origin}/course?user=${email}&tier=${tier}`;
                    navigator.clipboard.writeText(link);
                    alert("✅ Kurs-Link für Freunde kopiert!");
                  }}
                  className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white font-black py-4 px-6 rounded-xl transition border border-slate-600 text-lg"
                >
                  🔗 Mit Freunden teilen
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="bg-slate-900/95 border-t border-slate-700 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-slate-300 font-medium">
          <p>
            © 2025 ProStar Marketing | 
            <a
              href="mailto:support@prostarmarketing.de"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline ml-2"
            >
              support@prostarmarketing.de
            </a>
          </p>
          <p className="text-xs text-slate-400 mt-3">
            Dein Zugang ist gespeichert in: Browser-Cache (localStorage) + Server-Datenbank (MySQL)
          </p>
        </div>
      </footer>
    </div>
  );
}
