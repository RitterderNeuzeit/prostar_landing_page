import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function MiniCourseSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Simulate email submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store email in localStorage for tracking
      localStorage.setItem("miniCourseEmail", email);
      localStorage.setItem("miniCourseSignupDate", new Date().toISOString());

      setSubmitted(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/course";
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-accent">
            ProStar
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-accent hover:text-accent/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="section-padding">
        <div className="container max-w-2xl">
          {!submitted ? (
            <>
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Kostenlose Mini-Lektion
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Erhalten Sie sofort Zugriff auf unsere exklusive Mini-Lektion
                  zum Social-Media-Masterplan.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="card">
                  <CheckCircle className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">Sofort Zugriff</h3>
                  <p className="text-sm text-muted-foreground">
                    Erhalten Sie die Mini-Lektion sofort nach der Anmeldung
                  </p>
                </div>
                <div className="card">
                  <CheckCircle className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">Kostenlos</h3>
                  <p className="text-sm text-muted-foreground">
                    Völlig kostenlos, keine versteckten Gebühren
                  </p>
                </div>
                <div className="card">
                  <CheckCircle className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">Praktisch</h3>
                  <p className="text-sm text-muted-foreground">
                    Sofort umsetzbare Tipps und Strategien
                  </p>
                </div>
              </div>

              {/* Signup Form */}
              <div className="card max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6">Jetzt anmelden</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ihre E-Mail-Adresse
                    </label>
                    <Input
                      type="email"
                      placeholder="ihre@email.de"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={loading || !email}
                  >
                    {loading ? "Wird verarbeitet..." : "Mini-Lektion erhalten"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Wir respektieren Ihre Privatsphäre. Abmeldung jederzeit
                    möglich.
                  </p>
                </form>
              </div>

              {/* Course Preview */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Was Sie erwartet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h4 className="font-semibold mb-2">
                      📱 Social-Media-Grundlagen
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Verstehen Sie die Grundprinzipien erfolgreicher
                      Social-Media-Strategien
                    </p>
                  </div>
                  <div className="card">
                    <h4 className="font-semibold mb-2">📊 Daten-Analyse</h4>
                    <p className="text-sm text-muted-foreground">
                      Lernen Sie, Ihre Metriken zu verstehen und zu optimieren
                    </p>
                  </div>
                  <div className="card">
                    <h4 className="font-semibold mb-2">
                      ✍️ Content-Erstellung
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Praktische Tipps für hochwertige Inhalte, die konvertieren
                    </p>
                  </div>
                  <div className="card">
                    <h4 className="font-semibold mb-2">
                      🎯 Zielgruppen-Targeting
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Erreichen Sie die richtige Zielgruppe mit präzisierten
                      Strategien
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card max-w-md mx-auto text-center py-12">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Erfolgreich angemeldet!
              </h2>
              <p className="text-muted-foreground mb-6">
                Überprüfen Sie Ihre E-Mail-Adresse für die Mini-Lektion.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Sie werden in Kürze zum Kurs weitergeleitet...
              </p>
              <Link href="/" className="inline-block">
                <Button className="btn-secondary">Zur Startseite</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
