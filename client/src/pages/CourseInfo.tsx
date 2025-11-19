import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, BookOpen, Users, Award, Clock } from "lucide-react";
import { Link } from "wouter";
import CheckoutButton from "@/components/CheckoutButton";

export default function CourseInfo() {
  const [selectedTier, setSelectedTier] = useState<
    "starter" | "professional" | "enterprise"
  >("professional");

  const tiers = [
    {
      id: "starter",
      name: "Starter",
      price: 97,
      description: "Perfekt für Anfänger",
      modules: 3,
      features: [
        "5 Video-Module",
        "Workbooks & Templates",
        "Lebenslanger Zugriff",
        "Community Forum",
        "Email-Support",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: 197,
      description: "Für wachsende Unternehmen",
      modules: 8,
      features: [
        "Alle Starter-Inhalte",
        "Bonus: Fallstudien",
        "Community Forum",
        "Prioritäts-Support",
        "Monatliche Live-Sessions",
        "Vorlagen & Checklisten",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 497,
      description: "Für Teams & Agenturen",
      modules: 9,
      features: [
        "Alle Professional-Inhalte",
        "1:1 Coaching Session",
        "Mehrplatz-Lizenz",
        "Dedizierter Account Manager",
        "Quartals-Strategie-Sessions",
        "Custom Templates",
      ],
    },
  ];

  const courseModules = [
    {
      number: 1,
      title: "Strategie & Positionierung",
      description:
        "Entwickeln Sie Ihre einzigartige Social-Media-Strategie basierend auf Ihrer Geschäftsziele und Zielgruppe.",
      lessons: 8,
      duration: "2 Stunden",
    },
    {
      number: 2,
      title: "Content-Planung & Erstellung",
      description:
        "Lernen Sie, hochwertige Inhalte zu planen und zu erstellen, die Ihre Zielgruppe engagiert.",
      lessons: 10,
      duration: "2.5 Stunden",
    },
    {
      number: 3,
      title: "Community & Engagement",
      description:
        "Bauen Sie eine loyale Community auf und steigern Sie das Engagement mit bewährten Taktiken.",
      lessons: 7,
      duration: "1.5 Stunden",
    },
    {
      number: 4,
      title: "Analytics & Optimierung",
      description:
        "Verstehen Sie Ihre Metriken und optimieren Sie Ihre Kampagnen basierend auf Daten.",
      lessons: 9,
      duration: "2 Stunden",
    },
    {
      number: 5,
      title: "Conversion & Verkauf",
      description:
        "Verwandeln Sie Ihre Social-Media-Präsenz in messbare geschäftliche Ergebnisse.",
      lessons: 11,
      duration: "3 Stunden",
    },
  ];

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
        <div className="container">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Social-Media-Masterplan für Ihr Business
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Lernen Sie die bewährten Strategien, um Ihre Social-Media-Präsenz
              aufzubauen, Ihre Zielgruppe zu engagieren und Ihre Geschäftsziele
              zu erreichen.
            </p>
          </div>

          {/* Course Modules */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">5 Umfassende Module</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {courseModules.map(module => (
                <div key={module.number} className="card">
                  <div className="text-4xl font-bold text-accent mb-3">
                    {module.number}
                  </div>
                  <h3 className="font-semibold mb-3">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {module.description}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {module.lessons} Lektionen
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">
              Was ist im Kurs enthalten?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <BookOpen className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">Video-Lektionen</h3>
                <p className="text-sm text-muted-foreground">
                  45+ hochwertige Video-Lektionen (5-15 Minuten)
                </p>
              </div>
              <div className="card">
                <Award className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">Workbooks & Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Praktische Vorlagen zum sofortigen Einsatz
                </p>
              </div>
              <div className="card">
                <Users className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground">
                  Austausch mit anderen Kursteilnehmern
                </p>
              </div>
              <div className="card">
                <Clock className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">Lebenslanger Zugriff</h3>
                <p className="text-sm text-muted-foreground">
                  Unbegrenzter Zugriff auf alle Inhalte
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Wählen Sie Ihren Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {tiers.map(tier => (
                <div
                  key={tier.id}
                  className={`card relative transition-all ${
                    tier.popular ? "border-2 border-accent md:scale-105" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Beliebt
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground mb-6">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{tier.price}</span>
                    <span className="text-muted-foreground ml-2">einmalig</span>
                  </div>

                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-sm text-muted-foreground">
                      {tier.modules} Module • {tier.modules * 2} Stunden Inhalte
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <CheckoutButton
                    tier={tier.id as "starter" | "professional" | "enterprise"}
                    className="w-full"
                  >
                    Jetzt buchen
                  </CheckoutButton>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="card bg-card/50 border-2 border-accent/20 max-w-2xl mx-auto text-center py-12">
            <Award className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              30-Tage Geld-zurück Garantie
            </h3>
            <p className="text-muted-foreground">
              Wenn Sie nicht zu 100% zufrieden sind, erhalten Sie Ihr Geld
              zurück. Keine Fragen gestellt.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
