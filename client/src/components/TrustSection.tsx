import {
  Award,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
} from "lucide-react";

interface TrustSectionProps {
  variant?: "warm-minimal" | "professional" | "artisanal";
}

export default function TrustSection({
  variant = "warm-minimal",
}: TrustSectionProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "professional":
        return {
          container: "bg-gray-50",
          heading: "text-gray-900",
          subheading: "text-gray-600",
          badge: "bg-white border border-gray-200 hover:border-[#6B8E5F]",
          accent: "text-[#6B8E5F]",
          icon: "text-[#6B8E5F]",
          stat: "text-[#6B8E5F]",
        };
      case "artisanal":
        return {
          container: "bg-[#F5F1ED]",
          heading: "text-[#2C2C2C]",
          subheading: "text-[#2C2C2C]/70",
          badge: "bg-[#D4C4B8] border-2 border-[#C85A3A]/20",
          accent: "text-[#C85A3A]",
          icon: "text-[#C85A3A]",
          stat: "text-[#C85A3A]",
        };
      default: // warm-minimal
        return {
          container: "bg-background",
          heading: "text-foreground",
          subheading: "text-muted-foreground",
          badge: "card",
          accent: "text-accent",
          icon: "text-accent",
          stat: "text-accent",
        };
    }
  };

  const classes = getVariantClasses();

  const trustBadges = [
    {
      icon: Award,
      title: "Zertifizierter Kurs",
      description:
        "Professionell entwickelt und von Branchenexperten validiert",
    },
    {
      icon: Shield,
      title: "30-Tage Geld-zurück",
      description: "Vollständige Rückerstattung, wenn Sie nicht zufrieden sind",
    },
    {
      icon: Users,
      title: "500+ Teilnehmer",
      description:
        "Vertraut von Unternehmern in Deutschland, Österreich & Schweiz",
    },
    {
      icon: TrendingUp,
      title: "Nachgewiesene Ergebnisse",
      description: "Durchschnittlich €85K zusätzlicher Umsatz pro Teilnehmer",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Zufriedene Teilnehmer",
      description: "Aus verschiedenen Branchen und Unternehmensgrößen",
    },
    {
      number: "98%",
      label: "Zufriedenheitsrate",
      description: "Würden den Kurs weiterempfehlen",
    },
    {
      number: "€2.5M+",
      label: "Zusätzlicher Umsatz",
      description: "Generiert durch Kursteilnehmer",
    },
    {
      number: "4.9/5",
      label: "Durchschnittliche Bewertung",
      description: "Basierend auf 500+ Bewertungen",
    },
  ];

  const credentials = [
    {
      title: "Branchenexperten",
      description:
        "Entwickelt von Social-Media-Profis mit 15+ Jahren Erfahrung",
      icon: "👨‍💼",
    },
    {
      title: "Aktuelle Inhalte",
      description: "Monatlich aktualisiert mit neuen Plattform-Features",
      icon: "📱",
    },
    {
      title: "Praktische Anwendung",
      description: "Alle Strategien sind real getestet und funktionieren",
      icon: "✅",
    },
    {
      title: "Community Support",
      description: "Exklusives Forum für Fragen und Austausch",
      icon: "🤝",
    },
  ];

  return (
    <section className={`py-20 md:py-32 ${classes.container}`}>
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${classes.heading}`}
          >
            Warum Sie uns vertrauen können
          </h2>
          <p className={`text-lg ${classes.subheading}`}>
            Transparenz, Qualität und nachgewiesene Ergebnisse sind die
            Grundlage unseres Kurses.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className={`${classes.badge} rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300`}
              >
                <Icon className={`w-8 h-8 ${classes.icon} mx-auto mb-3`} />
                <h3 className={`font-semibold ${classes.heading} mb-2`}>
                  {badge.title}
                </h3>
                <p className={`text-sm ${classes.subheading}`}>
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div
          className={`rounded-lg p-8 md:p-12 mb-16 ${variant === "professional" ? "bg-white border border-gray-200" : variant === "artisanal" ? "bg-[#D4C4B8] border-2 border-[#C85A3A]/20" : "bg-card"}`}
        >
          <h3
            className={`text-2xl font-bold text-center mb-12 ${classes.heading}`}
          >
            Nachgewiesene Ergebnisse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${classes.stat} mb-2`}>
                  {stat.number}
                </div>
                <h4 className={`font-semibold ${classes.heading} mb-1`}>
                  {stat.label}
                </h4>
                <p className={`text-sm ${classes.subheading}`}>
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className="mb-16">
          <h3
            className={`text-2xl font-bold text-center mb-12 ${classes.heading}`}
          >
            Unsere Qualifikationen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {credentials.map((credential, index) => (
              <div
                key={index}
                className={`${classes.badge} rounded-lg p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-3xl flex-shrink-0">{credential.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${classes.heading} mb-1`}>
                    {credential.title}
                  </h4>
                  <p className={`text-sm ${classes.subheading}`}>
                    {credential.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Highlights */}
        <div
          className={`rounded-lg p-8 md:p-12 ${variant === "professional" ? "bg-white border border-gray-200" : variant === "artisanal" ? "bg-[#D4C4B8] border-2 border-[#C85A3A]/20" : "bg-card"}`}
        >
          <h3
            className={`text-2xl font-bold text-center mb-8 ${classes.heading}`}
          >
            Was Teilnehmer sagen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Der beste Kurs, den ich je gemacht habe. Praktisch, verständlich und mit sofortigen Ergebnissen.",
                author: "Sarah M.",
                role: "Unternehmerin",
              },
              {
                quote:
                  "Endlich jemand, der erklärt, wie Social Media wirklich funktioniert. Keine Tricks, nur echte Strategien.",
                author: "Thomas W.",
                role: "Consultant",
              },
              {
                quote:
                  "Meine Investition hat sich bereits nach 2 Monaten amortisiert. Absolut empfehlenswert!",
                author: "Julia S.",
                role: "Designerin",
              },
            ].map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 fill-current ${classes.stat}`}
                    />
                  ))}
                </div>
                <p className={`italic ${classes.subheading} mb-4`}>
                  "{testimonial.quote}"
                </p>
                <p className={`font-semibold ${classes.heading}`}>
                  {testimonial.author}
                </p>
                <p className={`text-sm ${classes.subheading}`}>
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Free Guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <CheckCircle className={`w-6 h-6 ${classes.icon}`} />
            <span className={`text-lg font-semibold ${classes.heading}`}>
              100% Zufriedenheitsgarantie
            </span>
          </div>
          <p className={`max-w-2xl mx-auto ${classes.subheading}`}>
            Wenn Sie nach 30 Tagen nicht vollständig zufrieden sind, erhalten
            Sie Ihr Geld zurück – ohne Fragen. Wir sind so überzeugt von der
            Qualität unseres Kurses, dass wir dieses Risiko gerne tragen.
          </p>
        </div>
      </div>
    </section>
  );
}
