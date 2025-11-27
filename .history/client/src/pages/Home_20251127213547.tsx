import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Star, Check, ArrowRight } from "lucide-react";
import CaseStudies from "@/components/CaseStudies";
import EnhancedTestimonials from "@/components/EnhancedTestimonials";
import TrustSection from "@/components/TrustSection";
import ChatWidget from "@/components/ChatWidget";
import PaymentModal from "@/components/PaymentModal";
import CheckoutButton from "@/components/CheckoutButton";
import landingContent from "../../../content/landing.json";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    tier?: "starter" | "professional" | "enterprise";
    price?: number;
  }>({ isOpen: false });

  const handleEmailSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  // Removed: testimonials array (moved to EnhancedTestimonials component)
  // Removed: case studies (moved to CaseStudies component)

  const modules = landingContent.modules;

  // Testimonials moved to EnhancedTestimonials component
  // Case studies moved to CaseStudies component

  const faqs = landingContent.faqs;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-accent">ProStar</div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#modules"
              className="text-sm hover:text-accent transition-colors"
            >
              Module
            </a>
            <a
              href="#results"
              className="text-sm hover:text-accent transition-colors"
            >
              Ergebnisse
            </a>
            <a
              href="#pricing"
              className="text-sm hover:text-accent transition-colors"
            >
              Preise
            </a>
            <a
              href="#faq"
              className="text-sm hover:text-accent transition-colors"
            >
              FAQ
            </a>
          </div>
          <Button className="btn-primary">Jetzt Anmelden</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              {landingContent.brand.headline}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {landingContent.brand.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/kostenloser-kurs">
                <Button className="btn-primary">
                  Kostenloser Kurs <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href={landingContent.ctas.secondary.href}>
                <Button className="btn-secondary">
                  {landingContent.ctas.secondary.label}
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-accent" />
                <span>Lebenslanger Zugriff</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-accent" />
                <span>30 Tage Geld-zurück</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block animate-slide-in-right">
            <img
              src="https://picsum.photos/1280/720"
              alt="Entfesseltes Potenzial"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Pain → Solution Section */}
      <section className="section-padding bg-card">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Das Problem</h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Viele Unternehmer wissen nicht, wie sie ihre Social-Media-Kanäle
            effektiv nutzen können.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Keine klare Strategie
              </h3>
              <p className="text-muted-foreground">
                Ohne Strategie führt Social Media zu Zeitverschwendung und
                keinen messbaren Ergebnissen.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Niedriges Engagement
              </h3>
              <p className="text-muted-foreground">
                Ihre Inhalte erreichen nicht die richtige Zielgruppe und
                generieren wenig Interaktion.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Keine Conversion</h3>
              <p className="text-muted-foreground">
                Social Media bringt keine echten Geschäftsergebnisse oder
                Verkäufe.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Die Lösung</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unser Social-Media-Masterplan gibt Ihnen ein bewährtes System, um
              Ihre Präsenz aufzubauen, Ihre Zielgruppe zu engagieren und
              messbare Geschäftsergebnisse zu erzielen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card border-l-4 border-accent">
              <h3 className="text-xl font-semibold mb-2">✓ Klare Strategie</h3>
              <p className="text-muted-foreground">
                Schritt-für-Schritt Anleitung zur Entwicklung Ihrer
                einzigartigen Social-Media-Strategie.
              </p>
            </div>

            <div className="card border-l-4 border-accent">
              <h3 className="text-xl font-semibold mb-2">✓ Hohe Engagement</h3>
              <p className="text-muted-foreground">
                Bewährte Taktiken zur Steigerung des Engagements und zum Aufbau
                einer loyalen Community.
              </p>
            </div>

            <div className="card border-l-4 border-accent">
              <h3 className="text-xl font-semibold mb-2">
                ✓ Messbare Ergebnisse
              </h3>
              <p className="text-muted-foreground">
                Lernen Sie, Ihre Metriken zu verstehen und Ihre Kampagnen zu
                optimieren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Modules Section */}
      <section id="modules" className="section-padding">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">
            Was Sie lernen werden
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            5 umfassende Module, die Sie von Anfänger zu Social-Media-Experte
            machen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="card group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <span className="text-accent font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Format & Results Section */}
      <section id="results" className="section-padding bg-card">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">
            Format & Ergebnisse
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Praktische, umsetzbare Inhalte mit echten Ergebnissen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Kursformat</h3>
              <ul className="space-y-4">
                {[
                  "Video-Lektionen (5-15 Minuten)",
                  "Praktische Workbooks & Templates",
                  "Checklisten für sofortige Umsetzung",
                  "Fallstudien von echten Unternehmen",
                  "Bonus: Community Forum für Austausch",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Was Sie erreichen</h3>
              <ul className="space-y-4">
                {[
                  "Klare Social-Media-Strategie",
                  "Konsistente Content-Planung",
                  "Höheres Engagement & Follower-Wachstum",
                  "Bessere Konversionsraten",
                  "Messbare Geschäftsergebnisse",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof Sections */}
      <EnhancedTestimonials variant="warm-minimal" />
      <CaseStudies variant="warm-minimal" />
      <TrustSection variant="warm-minimal" />

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-card">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Preise</h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Investieren Sie in Ihr Business-Wachstum.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-6">Perfekt für Anfänger</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€97</span>
                <span className="text-muted-foreground ml-2">einmalig</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">5 Video-Module</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Workbooks & Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Lebenslanger Zugriff</span>
                </li>
              </ul>
              <CheckoutButton tier="starter" className="w-full btn-secondary">
                Jetzt buchen
              </CheckoutButton>
            </div>

            <div className="card border-2 border-accent relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                Beliebt
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-muted-foreground mb-6">
                Für wachsende Unternehmen
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€197</span>
                <span className="text-muted-foreground ml-2">einmalig</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Alle Starter-Inhalte</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Bonus: Fallstudien</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Community Forum</span>
                </li>
              </ul>
              <CheckoutButton
                tier="professional"
                className="w-full btn-primary"
              >
                Jetzt buchen
              </CheckoutButton>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-6">
                Für Teams & Agenturen
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€497</span>
                <span className="text-muted-foreground ml-2">einmalig</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Alle Professional-Inhalte</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">1:1 Coaching Session</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">Mehrplatz-Lizenz</span>
                </li>
              </ul>
              <CheckoutButton
                tier="enterprise"
                className="w-full btn-secondary"
              >
                Jetzt buchen
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-Lesson Opt-in Section */}
      <section className="section-padding bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="container max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Kostenlose Mini-Lektion
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-8">
            Erhalten Sie sofort Zugriff auf unsere kostenlose Mini-Lektion "Die
            5 Säulen einer erfolgreichen Social-Media-Strategie".
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Ihre E-Mail-Adresse
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full btn-primary">
              Mini-Lektion herunterladen
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Wir respektieren Ihre Privatsphäre. Abmeldung jederzeit möglich.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Antworten auf die wichtigsten Fragen zum Kurs.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card cursor-pointer"
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-accent transition-transform ${activeTab === index ? "rotate-180" : ""}`}
                  />
                </div>
                {activeTab === index && (
                  <p className="text-muted-foreground mt-4">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">ProStar Marketing</h4>
              <p className="text-sm text-muted-foreground">
                Wir helfen Unternehmern, ihre Social-Media-Präsenz aufzubauen
                und zu monetarisieren.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produkte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Kurse
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Coaching
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Über uns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Kontakt
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    AGB
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">
                © 2024 ProStar Marketing. Alle Rechte vorbehalten.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <ChatWidget />

      {/* Payment Modal */}
      {paymentModal.isOpen && paymentModal.tier && paymentModal.price && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false })}
          courseTitle="Social-Media-Masterplan für Ihr Business"
          price={paymentModal.price}
          tier={paymentModal.tier}
        />
      )}
    </div>
  );
}
