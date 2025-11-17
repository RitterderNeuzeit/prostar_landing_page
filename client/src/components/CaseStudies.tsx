import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, Users, Target } from 'lucide-react';

interface CaseStudy {
  id: number;
  company: string;
  industry: string;
  founder: string;
  challenge: string;
  solution: string;
  results: {
    metric1: { label: string; value: string; description: string };
    metric2: { label: string; value: string; description: string };
    metric3: { label: string; value: string; description: string };
  };
  testimonial: string;
  image: string;
  duration: string;
  platforms: string[];
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    company: 'Müller Consulting GmbH',
    industry: 'Business Consulting',
    founder: 'Sarah Müller',
    challenge:
      'Sarah betrieb eine erfolgreiche Consulting-Agentur, aber ihre Social-Media-Präsenz war schwach. Sie wusste nicht, wie sie ihre Expertise online zeigen konnte, um neue Kunden zu gewinnen.',
    solution:
      'Mit dem Social-Media-Masterplan entwickelte Sarah eine klare LinkedIn-Strategie, um ihre Gedanken und Insights zu teilen. Sie erstellte regelmäßig hochwertige Content über Business-Trends und ihre Erfahrungen.',
    results: {
      metric1: {
        label: 'LinkedIn Follower',
        value: '+450%',
        description: 'Wuchs von 200 auf 1.100 Follower in 6 Monaten',
      },
      metric2: {
        label: 'Neue Kunden',
        value: '12',
        description: 'Direkt aus LinkedIn-Netzwerk gewonnen',
      },
      metric3: {
        label: 'Umsatzsteigerung',
        value: '+€85K',
        description: 'Zusätzlicher Jahresumsatz durch neue Kunden',
      },
    },
    testimonial:
      'Der Kurs hat mir gezeigt, dass ich nicht jeden Tag posten muss, sondern strategisch und authentisch. Meine LinkedIn-Präsenz ist jetzt mein bestes Akquisitions-Tool.',
    image: '/images/case-study-mueller.jpg',
    duration: '6 Monate',
    platforms: ['LinkedIn', 'Newsletter'],
    tags: ['B2B', 'Consulting', 'Lead Generation'],
  },
  {
    id: 2,
    company: 'Weber & Partner Rechtsanwälte',
    industry: 'Legal Services',
    founder: 'Dr. Thomas Weber',
    challenge:
      'Als Rechtsanwalt war Dr. Weber skeptisch gegenüber Social Media. Er dachte, es sei nicht professionell genug für seine Branche. Gleichzeitig verlor er Mandanten an jüngere Konkurrenten.',
    solution:
      'Der Kurs half ihm zu verstehen, dass Social Media auch für traditionelle Branchen funktioniert. Er startete mit LinkedIn und Instagram, um seine Expertise zu zeigen und Vertrauen aufzubauen.',
    results: {
      metric1: {
        label: 'Mandanten-Anfragen',
        value: '+8x',
        description: 'Stieg von 2 auf 16 Anfragen pro Monat',
      },
      metric2: {
        label: 'Engagement Rate',
        value: '12%',
        description: 'Deutlich über Branchendurchschnitt von 2-3%',
      },
      metric3: {
        label: 'Conversion Rate',
        value: '35%',
        description: 'Von Anfrage zu Mandat',
      },
    },
    testimonial:
      'Ich war überrascht, wie sehr Social Media in meiner Branche funktioniert. Der Kurs hat mir die Angst genommen und mir gezeigt, dass Authentizität und Expertise online genauso wichtig sind wie im Büro.',
    image: '/images/case-study-weber.jpg',
    duration: '4 Monate',
    platforms: ['LinkedIn', 'Instagram'],
    tags: ['B2B', 'Legal', 'Vertrauensaufbau'],
  },
  {
    id: 3,
    company: 'Schmidt Design Studio',
    industry: 'Graphic & Web Design',
    founder: 'Julia Schmidt',
    challenge:
      'Julia hatte großartige Design-Arbeiten, aber ihre Instagram-Präsenz war chaotisch. Sie postete unregelmäßig, ohne klare Strategie, und konnte ihre Arbeiten nicht effektiv verkaufen.',
    solution:
      'Mit dem Masterplan entwickelte Julia einen konsistenten Content-Kalender, zeigte ihre Design-Prozesse und erzählte Geschichten über ihre Kunden. Sie nutzte Instagram Reels und Stories strategisch.',
    results: {
      metric1: {
        label: 'Instagram Follower',
        value: '+280%',
        description: 'Wuchs von 800 auf 3.040 Follower',
      },
      metric2: {
        label: 'Projektanfragen',
        value: '25/Monat',
        description: 'Durchschnittlich 25 qualifizierte Anfragen pro Monat',
      },
      metric3: {
        label: 'Projektbudget',
        value: '+€120K',
        description: 'Jährlich zusätzliches Projektbudget',
      },
    },
    testimonial:
      'Der Kurs hat mir geholfen, meine Arbeiten nicht nur zu zeigen, sondern zu verkaufen. Jetzt ist Instagram mein wichtigster Kundenkanal. Meine beste Investition für mein Business!',
    image: '/images/case-study-schmidt.jpg',
    duration: '5 Monate',
    platforms: ['Instagram', 'TikTok'],
    tags: ['B2C', 'Creative', 'Community Building'],
  },
  {
    id: 4,
    company: 'Bergmann Handmade GmbH',
    industry: 'E-Commerce / Handmade',
    founder: 'Anna Bergmann',
    challenge:
      'Anna verkaufte handgemachte Produkte online, aber ihre Social-Media-Strategie war reaktiv. Sie wusste nicht, wie sie ihre einzigartige Geschichte und ihre Leidenschaft für ihre Handwerk online vermitteln konnte.',
    solution:
      'Mit dem Masterplan entwickelte Anna eine authentische Storytelling-Strategie. Sie zeigte ihren Herstellungsprozess, teilte ihre Werte und baute eine Community von Menschen, die ihre Philosophie teilten.',
    results: {
      metric1: {
        label: 'Online-Verkäufe',
        value: '+340%',
        description: 'Stieg von €12K auf €53K monatlich',
      },
      metric2: {
        label: 'Community-Größe',
        value: '+5.200',
        description: 'Treue Follower, die regelmäßig kaufen',
      },
      metric3: {
        label: 'Kundenbindung',
        value: '68%',
        description: 'Wiederholungskäufer-Rate',
      },
    },
    testimonial:
      'Der Kurs hat mir gezeigt, dass meine Geschichte mein bestes Marketing-Tool ist. Meine Kunden kaufen nicht nur Produkte, sie unterstützen meine Mission. Das hat alles verändert.',
    image: '/images/case-study-bergmann.jpg',
    duration: '7 Monate',
    platforms: ['Instagram', 'TikTok', 'Pinterest'],
    tags: ['E-Commerce', 'Handmade', 'Storytelling'],
  },
  {
    id: 5,
    company: 'Rossi Café & Bakery',
    industry: 'Food & Beverage',
    founder: 'Marco Rossi',
    challenge:
      'Marco betrieb ein lokales Café, das von Stammkunden lebte. Er wollte mehr Fuß-Verkehr generieren und sein Café als Destination-Ort positionieren, aber wusste nicht, wie Social Media helfen konnte.',
    solution:
      'Mit dem Masterplan nutzte Marco Instagram und TikTok, um seine Café-Kultur zu zeigen. Er postete Rezepte, Behind-the-Scenes-Inhalte und User-Generated-Content von Gästen.',
    results: {
      metric1: {
        label: 'Tägliche Besucher',
        value: '+65%',
        description: 'Stieg von durchschnittlich 120 auf 198 Besucher',
      },
      metric2: {
        label: 'Umsatz',
        value: '+€45K',
        description: 'Zusätzlicher Jahresumsatz',
      },
      metric3: {
        label: 'Viral-Momente',
        value: '3',
        description: 'TikTok-Videos mit über 100K Views',
      },
    },
    testimonial:
      'Ich dachte, Social Media ist nicht für lokale Cafés. Aber der Kurs zeigte mir, wie ich meine Community online engagieren und offline in mein Café bringen kann. Genial!',
    image: '/images/case-study-rossi.jpg',
    duration: '3 Monate',
    platforms: ['Instagram', 'TikTok'],
    tags: ['Local Business', 'F&B', 'Community'],
  },
];

interface CaseStudiesProps {
  variant?: 'warm-minimal' | 'professional' | 'artisanal';
}

export default function CaseStudies({ variant = 'warm-minimal' }: CaseStudiesProps) {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getVariantClasses = () => {
    switch (variant) {
      case 'professional':
        return {
          container: 'bg-gray-50',
          heading: 'text-gray-900',
          subheading: 'text-gray-600',
          card: 'bg-white border border-gray-200 hover:border-[#6B8E5F]',
          accent: 'text-[#6B8E5F]',
          metric: 'text-[#6B8E5F]',
          button: 'bg-[#6B8E5F] hover:bg-[#4A6341]',
        };
      case 'artisanal':
        return {
          container: 'bg-[#F5F1ED]',
          heading: 'text-[#2C2C2C]',
          subheading: 'text-[#2C2C2C]/70',
          card: 'bg-[#D4C4B8] border-2 border-[#C85A3A]/20 hover:border-[#C85A3A]',
          accent: 'text-[#C85A3A]',
          metric: 'text-[#C85A3A]',
          button: 'bg-[#C85A3A] hover:bg-[#A84A2A]',
        };
      default: // warm-minimal
        return {
          container: 'bg-background',
          heading: 'text-foreground',
          subheading: 'text-muted-foreground',
          card: 'card',
          accent: 'text-accent',
          metric: 'text-accent',
          button: 'btn-primary',
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <section className={`py-20 md:py-32 ${classes.container}`}>
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${classes.heading}`}>
            Erfolgsgeschichten unserer Teilnehmer
          </h2>
          <p className={`text-lg ${classes.subheading}`}>
            Echte Unternehmer, echte Ergebnisse. Sehen Sie, wie andere Unternehmen ihre Social-Media-Präsenz transformiert haben.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className={`${classes.card} rounded-lg p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              onClick={() => setExpandedId(expandedId === study.id ? null : study.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${classes.heading}`}>{study.company}</h3>
                  <p className={`text-sm ${classes.subheading}`}>{study.industry}</p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 ${classes.accent} transition-transform ${
                    expandedId === study.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {/* Founder & Duration */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200/30">
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${classes.heading}`}>{study.founder}</p>
                  <p className={`text-xs ${classes.subheading}`}>{study.duration} Transformation</p>
                </div>
                <div className="flex gap-1">
                  {study.platforms.map((platform) => (
                    <span
                      key={platform}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        variant === 'professional'
                          ? 'bg-[#6B8E5F]/10 text-[#6B8E5F]'
                          : variant === 'artisanal'
                            ? 'bg-[#C85A3A]/10 text-[#C85A3A]'
                            : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenge */}
              <div className="mb-4">
                <h4 className={`text-sm font-semibold ${classes.accent} mb-2`}>Die Herausforderung</h4>
                <p className={`text-sm ${classes.subheading}`}>{study.challenge}</p>
              </div>

              {/* Key Metrics Preview */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className={`text-center p-3 rounded ${variant === 'professional' ? 'bg-gray-100' : variant === 'artisanal' ? 'bg-[#C85A3A]/10' : 'bg-accent/10'}`}>
                  <p className={`text-lg font-bold ${classes.metric}`}>{study.results.metric1.value}</p>
                  <p className={`text-xs ${classes.subheading}`}>{study.results.metric1.label}</p>
                </div>
                <div className={`text-center p-3 rounded ${variant === 'professional' ? 'bg-gray-100' : variant === 'artisanal' ? 'bg-[#C85A3A]/10' : 'bg-accent/10'}`}>
                  <p className={`text-lg font-bold ${classes.metric}`}>{study.results.metric2.value}</p>
                  <p className={`text-xs ${classes.subheading}`}>{study.results.metric2.label}</p>
                </div>
                <div className={`text-center p-3 rounded ${variant === 'professional' ? 'bg-gray-100' : variant === 'artisanal' ? 'bg-[#C85A3A]/10' : 'bg-accent/10'}`}>
                  <p className={`text-lg font-bold ${classes.metric}`}>{study.results.metric3.value}</p>
                  <p className={`text-xs ${classes.subheading}`}>{study.results.metric3.label}</p>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === study.id && (
                <div className="mt-6 pt-6 border-t border-gray-200/30 animate-slide-up">
                  <h4 className={`text-sm font-semibold ${classes.accent} mb-2`}>Die Lösung</h4>
                  <p className={`text-sm ${classes.subheading} mb-4`}>{study.solution}</p>

                  <h4 className={`text-sm font-semibold ${classes.accent} mb-2`}>Detaillierte Ergebnisse</h4>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className={`text-sm font-semibold ${classes.heading}`}>{study.results.metric1.label}</p>
                      <p className={`text-xs ${classes.subheading}`}>{study.results.metric1.description}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${classes.heading}`}>{study.results.metric2.label}</p>
                      <p className={`text-xs ${classes.subheading}`}>{study.results.metric2.description}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${classes.heading}`}>{study.results.metric3.label}</p>
                      <p className={`text-xs ${classes.subheading}`}>{study.results.metric3.description}</p>
                    </div>
                  </div>

                  <h4 className={`text-sm font-semibold ${classes.accent} mb-2`}>Testimonial</h4>
                  <p className={`text-sm italic ${classes.subheading}`}>"{study.testimonial}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200/30">
          <div className="text-center">
            <div className={`text-4xl font-bold ${classes.metric} mb-2`}>500+</div>
            <p className={`${classes.subheading}`}>Zufriedene Teilnehmer</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${classes.metric} mb-2`}>€2.5M+</div>
            <p className={`${classes.subheading}`}>Zusätzlicher Umsatz generiert</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${classes.metric} mb-2`}>98%</div>
            <p className={`${classes.subheading}`}>Zufriedenheitsrate</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className={`text-lg ${classes.subheading} mb-6`}>
            Möchten Sie die nächste Erfolgsgeschichte sein?
          </p>
          <Button
            className={`${classes.button} text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
          >
            Jetzt Kurs buchen <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
