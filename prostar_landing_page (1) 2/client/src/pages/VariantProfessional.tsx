import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Check, ArrowRight } from 'lucide-react';

/**
 * Sachlich-Professional Design Variant
 * 
 * Color Scheme:
 * - Background: White (#FFFFFF)
 * - Accent: Olive Green (#6B8E5F)
 * - Text: Charcoal (#2C2C2C)
 * - Accents: Gray-100 backgrounds
 * 
 * Style: Corporate, authoritative, business-focused
 * Best for: B2B decision-makers, enterprise audience
 */

export default function VariantProfessional() {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const modules = [
    {
      id: 1,
      title: 'Strategische Grundlagen',
      description: 'Entwickeln Sie eine datengestützte Social-Media-Strategie für nachhaltiges Wachstum.',
      icon: 'icon-strategy',
    },
    {
      id: 2,
      title: 'Content-Management',
      description: 'Professionelle Content-Planung und Erstellung für Ihre Zielgruppe.',
      icon: 'icon-content',
    },
    {
      id: 3,
      title: 'Community-Aufbau',
      description: 'Systematischer Aufbau einer engagierten und loyalen Community.',
      icon: 'icon-community',
    },
    {
      id: 4,
      title: 'Datenanalyse & KPIs',
      description: 'Verstehen Sie Ihre Metriken und treffen Sie datengestützte Entscheidungen.',
      icon: 'icon-analytics',
    },
    {
      id: 5,
      title: 'ROI & Geschäftsergebnisse',
      description: 'Konvertieren Sie Social-Media-Aktivität in messbare Geschäftsergebnisse.',
      icon: 'icon-conversion',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Martin Fischer',
      company: 'Fischer Consulting GmbH',
      text: 'Ein wissenschaftlich fundierter Kurs, der die Branche verändert. Die ROI-Metriken sind beeindruckend.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Petra Hoffmann',
      company: 'Hoffmann & Co. Rechtsanwälte',
      text: 'Professionell strukturiert und sofort umsetzbar. Empfehlung für alle B2B-Unternehmen.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Klaus Bergmann',
      company: 'Bergmann Industrie AG',
      text: 'Die beste Investition für unser Marketing-Team. Messbare Ergebnisse ab Woche 1.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'Welche Voraussetzungen gibt es?',
      answer: 'Der Kurs ist für Unternehmer, Manager und Marketing-Profis konzipiert. Grundlegende Social-Media-Kenntnisse sind hilfreich, aber nicht erforderlich.',
    },
    {
      question: 'Wie wird der Kurs aktualisiert?',
      answer: 'Wir aktualisieren den Kurs monatlich mit neuen Strategien und Plattform-Updates. Alle Updates sind für Kursteilnehmer kostenlos.',
    },
    {
      question: 'Gibt es ein Abschluss-Zertifikat?',
      answer: 'Ja, nach Abschluss aller Module erhalten Sie ein professionelles Zertifikat für LinkedIn und Ihr Portfolio.',
    },
    {
      question: 'Welche Plattformen werden abgedeckt?',
      answer: 'LinkedIn, Instagram, Facebook, TikTok und YouTube mit spezifischen B2B- und B2C-Strategien.',
    },
    {
      question: 'Kann ich den Kurs für mein Team nutzen?',
      answer: 'Ja, Gruppen- und Unternehmenslizenzen sind verfügbar. Bitte kontaktieren Sie uns für Volumenrabatte.',
    },
    {
      question: 'Wie ist der Support strukturiert?',
      answer: 'Sie haben Zugriff auf ein exklusives Forum, monatliche Live-Q&A-Sessions und E-Mail-Support.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#2C2C2C]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-[#6B8E5F]">ProStar</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm font-medium hover:text-[#6B8E5F] transition-colors">Module</a>
            <a href="#results" className="text-sm font-medium hover:text-[#6B8E5F] transition-colors">Ergebnisse</a>
            <a href="#pricing" className="text-sm font-medium hover:text-[#6B8E5F] transition-colors">Preise</a>
            <a href="#faq" className="text-sm font-medium hover:text-[#6B8E5F] transition-colors">FAQ</a>
          </div>
          <Button className="px-6 py-2 bg-[#6B8E5F] text-white hover:bg-[#4A6341] transition-colors">
            Jetzt Anmelden
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#2C2C2C]">
              Social-Media-Masterplan für Ihr Business
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Professionelle Strategien für nachhaltiges Wachstum. Lernen Sie, wie führende Unternehmen Social Media nutzen, um ihre Geschäftsziele zu erreichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="px-8 py-3 bg-[#6B8E5F] text-white hover:bg-[#4A6341] font-semibold transition-colors">
                Kurs buchen <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button className="px-8 py-3 border-2 border-[#6B8E5F] text-[#6B8E5F] hover:bg-gray-50 font-semibold transition-colors">
                Mehr erfahren
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#6B8E5F]" />
                <span>Lebenslanger Zugriff</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#6B8E5F]" />
                <span>30 Tage Geld-zurück</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#6B8E5F]" />
                <span>Zertifikat inkl.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#6B8E5F]" />
                <span>Live Q&A Sessions</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="/keyvisual-1280x720.jpg"
              alt="Entfesseltes Potenzial"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-8">Die Herausforderung</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fragmentierte Strategien</h3>
                    <p className="text-gray-600">Ohne kohärente Strategie führt Social Media zu Ressourcenverschwendung.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mangelnde Messbarkeit</h3>
                    <p className="text-gray-600">Viele Unternehmen wissen nicht, ob ihre Social-Media-Investitionen ROI bringen.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fehlende Expertise</h3>
                    <p className="text-gray-600">Die Plattformen entwickeln sich schnell, und es ist schwer, den Überblick zu behalten.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-8">Die Lösung</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#6B8E5F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Integrierte Strategie</h3>
                    <p className="text-gray-600">Ein bewährtes System, das alle Aspekte Ihrer Social-Media-Präsenz abdeckt.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#6B8E5F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Datengestützte Optimierung</h3>
                    <p className="text-gray-600">Lernen Sie, Ihre Metriken zu verstehen und Ihre Kampagnen zu optimieren.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#6B8E5F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Kontinuierliche Aktualisierung</h3>
                    <p className="text-gray-600">Monatliche Updates mit neuen Strategien und Plattform-Änderungen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">5 Umfassende Module</h2>
            <p className="text-lg text-gray-600">
              Strukturiert vom Anfänger zum Experten. Jedes Modul baut auf dem vorherigen auf.
            </p>
          </div>
          
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:border-[#6B8E5F] transition-colors">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-[#6B8E5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#6B8E5F]">0{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 md:py-32 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Messbare Ergebnisse</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#6B8E5F] mb-2">+250%</div>
              <p className="text-gray-600">Durchschnittliches Engagement-Wachstum</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#6B8E5F] mb-2">3x</div>
              <p className="text-gray-600">Schnellere Lead-Generierung</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#6B8E5F] mb-2">5:1</div>
              <p className="text-gray-600">Durchschnittlicher ROI</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Kursformat</h3>
              <ul className="space-y-4">
                {[
                  'Video-Module mit Transkripten',
                  'Workbooks & Checklisten',
                  'Fallstudien von Fortune-500-Unternehmen',
                  'Monatliche Live-Webinare',
                  'Exklusives Community-Forum',
                  'Lebenslange Aktualisierungen',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#6B8E5F] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Was Sie erreichen</h3>
              <ul className="space-y-4">
                {[
                  'Professionelle Social-Media-Strategie',
                  'Optimierte Content-Kalender',
                  'Messbare KPIs & Reporting',
                  'Community-Management-System',
                  'Conversion-Optimierung',
                  'Abschluss-Zertifikat',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#6B8E5F] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Vertraut von führenden Unternehmen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border border-gray-200 rounded-lg p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#6B8E5F]">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Transparente Preise</h2>
          <p className="text-center text-gray-600 text-lg mb-16">Wählen Sie den Plan, der zu Ihren Anforderungen passt.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Für Einzelunternehmer</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€97</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6B8E5F]" />
                  <span className="text-sm">5 Video-Module</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6B8E5F]" />
                  <span className="text-sm">Workbooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6B8E5F]" />
                  <span className="text-sm">Lebenslanger Zugriff</span>
                </li>
              </ul>
              <Button className="w-full border-2 border-[#6B8E5F] text-[#6B8E5F] hover:bg-gray-50">
                Jetzt buchen
              </Button>
            </div>
            
            <div className="bg-[#6B8E5F] text-white rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#6B8E5F] px-4 py-1 rounded-full text-sm font-semibold">
                Empfohlen
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-white/80 mb-6">Für wachsende Unternehmen</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€197</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Alle Starter-Inhalte</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Fallstudien</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Community Forum</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-[#6B8E5F] hover:bg-gray-100">
                Jetzt buchen
              </Button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Für Teams & Agenturen</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€497</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6B8E5F]" />
                  <span className="text-sm">Alle Professional-Inhalte</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6B8E5F]" />
                  <span className="text-sm">1:1 Coaching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6B8E5F]" />
                  <span className="text-sm">Mehrplatz-Lizenz</span>
                </li>
              </ul>
              <Button className="w-full border-2 border-[#6B8E5F] text-[#6B8E5F] hover:bg-gray-50">
                Kontakt
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#6B8E5F] text-white">
        <div className="container max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4">Starten Sie noch heute</h2>
          <p className="text-center text-white/90 text-lg mb-8">
            Erhalten Sie sofort Zugriff auf alle Module und beginnen Sie, Ihre Social-Media-Strategie zu transformieren.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                E-Mail-Adresse
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-[#6B8E5F] hover:bg-gray-100 font-semibold">
              Jetzt Kurs buchen
            </Button>
          </form>
          
          <p className="text-center text-xs text-white/70 mt-4">
            30 Tage Geld-zurück-Garantie. Keine Fragen gestellt.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-4">Häufig gestellte Fragen</h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Alles, was Sie über den Kurs wissen müssen.
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg cursor-pointer hover:border-[#6B8E5F] transition-colors"
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                <div className="flex items-center justify-between p-6">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6B8E5F] transition-transform ${
                      activeTab === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {activeTab === index && (
                  <div className="px-6 pb-6 border-t border-gray-200 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">ProStar Marketing</h4>
              <p className="text-sm text-gray-400">
                Professionelle Social-Media-Strategien für nachhaltiges Geschäftswachstum.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produkte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Kurse</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Coaching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Beratung</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-400 text-center">
              © 2024 ProStar Marketing. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
