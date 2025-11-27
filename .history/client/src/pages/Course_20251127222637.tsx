import React, { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Share2, BookOpen } from 'lucide-react';
import { Streamdown } from 'streamdown';
import { useNotification } from '@/contexts/NotificationContext';
import CourseModulesPreview from '@/components/CourseModulesPreview';

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
  const [userTier, setUserTier] = useState<'starter' | 'professional' | 'enterprise' | null>(null);

  useEffect(() => {
    // Check for order data in localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const userEmail = localStorage.getItem('userEmail');

    if (orderId) {
      const storedOrder = localStorage.getItem(`order_${orderId}`);
      if (storedOrder) {
        try {
          const order = JSON.parse(storedOrder);
          setOrderData(order);
          setUserTier(order.tier as 'starter' | 'professional' | 'enterprise');
        } catch (error) {
          console.error('Failed to parse order data:', error);
        }
      }
    } else if (userEmail) {
      // Check if user has purchased before
      const tier = localStorage.getItem(`userTier_${userEmail}`);
      if (tier === 'starter' || tier === 'professional' || tier === 'enterprise') {
        setUserTier(tier);
      }
    }

    setIsLoading(false);
  }, []);

  const handleDownloadCourse = () => {
    addNotification({
      type: 'info',
      title: 'Download',
      message: 'Laden Sie Module einzeln herunter, indem Sie sie öffnen.',
    });
  };

  const handleShareCourse = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KI-Prompting Kurs',
        text: 'Schau dir diesen großartigen KI-Kurs an!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification({
        type: 'success',
        title: 'Link kopiert',
        message: 'Der Kurs-Link wurde in die Zwischenablage kopiert.',
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
            <a href="/" className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
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
            Sie haben noch keinen Kurs gekauft. Wählen Sie einen Kurs aus, um Zugriff auf alle Module zu erhalten.
          </p>
          <Button
            onClick={() => (window.location.href = '/')}
            className="bg-accent hover:bg-accent/90"
          >
            Zum Kurs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </a>
            <div>
              <h1 className="text-xl font-bold">KI-Prompting Kurs</h1>
              <p className="text-sm text-muted-foreground">Tier: {userTier.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        <div className="bg-green-900/20 border-b border-green-500/50 text-green-100 px-4 py-3">
          <div className="container flex items-center justify-between">
            <div>
              <p className="font-semibold">✓ Zahlung erfolgreich!</p>
              <p className="text-sm opacity-90">
                Bestellnummer: {orderData.orderId} | Bestätigungsemail an {orderData.email}
              </p>
            </div>
            <BookOpen size={24} className="text-green-400" />
          </div>
        </div>
      )}

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Module Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-4">
              <CourseModulesPreview
                tier={userTier}
                userTier={userTier}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <article className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/30 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <BookOpen className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Willkommen zum KI-Prompting Meisterkurs!
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Ihr Zugang ist aktiviert. Starten Sie jetzt mit dem ersten Modul.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {userTier === 'starter' ? '3' : userTier === 'professional' ? '8' : '9'}
                  </div>
                  <div className="text-sm text-gray-400">Module verfügbar</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {userTier === 'starter' ? '60' : userTier === 'professional' ? '130' : '155'}+
                  </div>
                  <div className="text-sm text-gray-400">Minuten Content</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {userTier.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-400">Ihr Tier</div>
                </div>
              </div>
            </article>

            {/* Quick Start Guide */}
            <article className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🚀 Schnellstart-Anleitung
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Wählen Sie ein Modul</h3>
                    <p className="text-sm text-gray-400">
                      Klicken Sie in der Seitenleiste auf ein Modul, um den vollständigen Inhalt zu öffnen.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Lernen Sie Schritt für Schritt</h3>
                    <p className="text-sm text-gray-400">
                      Jedes Modul enthält praktische Beispiele, Übungen und Best Practices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Nutzen Sie die Vorlagen</h3>
                    <p className="text-sm text-gray-400">
                      Laden Sie Handouts und Prompt-Vorlagen herunter, um sofort loszulegen.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Course Progress Overview */}
            <article className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-2xl font-bold text-white mb-4">📈 Ihr Lernfortschritt</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Gesamtfortschritt</span>
                    <span className="text-gray-400">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  💡 Tipp: Ihr Fortschritt wird automatisch gespeichert, wenn Sie Module durcharbeiten.
                </p>
              </div>
            </article>

            {/* What's Next */}
            <article className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Empfohlener Lernpfad</h2>
              <div className="space-y-3">
                {userTier === 'starter' && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg">
                      <h3 className="font-semibold text-cyan-400 mb-2">→ Modul 1: Was ist KI wirklich?</h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Verstehen Sie die Grundlagen von KI und warum gutes Prompting entscheidend ist.
                      </p>
                      <div className="text-xs text-gray-400">⏱️ 15 Minuten</div>
                    </div>
                    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Modul 2: Das Kollegenprinzip</h3>
                      <p className="text-sm text-gray-400">
                        Lernen Sie, KI wie einen Mitarbeiter zu führen - mit klaren Rollen und Kontext.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Modul 3: KAAB-Formel</h3>
                      <p className="text-sm text-gray-400">
                        Die bewährte Formel für perfekte KI-Prompts.
                      </p>
                    </div>
                  </>
                )}
                {userTier === 'professional' && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg">
                      <h3 className="font-semibold text-cyan-400 mb-2">→ Modul 1-3: Grundlagen</h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Starten Sie mit den Basics und bauen Sie ein solides Fundament auf.
                      </p>
                      <div className="text-xs text-gray-400">⏱️ 60 Minuten</div>
                    </div>
                    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Modul 4-6: Advanced Techniken</h3>
                      <p className="text-sm text-gray-400">
                        Rollen-Prompting, Chain-of-Thought und KI-Agenten.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Modul 8-9: Vorlagen & Bonus</h3>
                      <p className="text-sm text-gray-400">
                        Quick-Reference-Guide und praktische Templates.
                      </p>
                    </div>
                  </>
                )}
                {userTier === 'enterprise' && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg">
                      <h3 className="font-semibold text-cyan-400 mb-2">→ Vollständiger Zugriff</h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Sie haben Zugang zu allen 9 Modulen inklusive Enterprise-exklusiver Automation-Inhalte.
                      </p>
                      <div className="text-xs text-gray-400">⏱️ 155+ Minuten</div>
                    </div>
                    <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <h3 className="font-semibold text-purple-400 mb-2">🏆 Modul 7: Lead-Management-Automation</h3>
                      <p className="text-sm text-gray-300">
                        Exklusiv für Enterprise: Automatisieren Sie Ihr Lead-Management mit KI-Agenten.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </article>

            {/* Support Section */}
            <article className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30 p-6">
              <h2 className="text-xl font-bold text-white mb-3">💬 Brauchen Sie Hilfe?</h2>
              <p className="text-gray-300 mb-4">
                Unser Support-Team steht Ihnen jederzeit zur Verfügung. Nutzen Sie den Chat-Widget unten rechts oder senden Sie uns eine E-Mail.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <span>📧</span>
                  E-Mail Support
                </Button>
                <Button variant="outline" className="gap-2">
                  <span>💬</span>
                  Live Chat
                </Button>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
