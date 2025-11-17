import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Check, Heart } from 'lucide-react';

/**
 * Handwerklich-Authentisch Design Variant
 * 
 * Color Scheme:
 * - Background: Warm Taupe (#D4C4B8) with cream accents
 * - Accent: Terracotta (#C85A3A)
 * - Text: Charcoal (#2C2C2C)
 * 
 * Style: Authentic, crafted, personal touch
 * Best for: SME owners, community-focused messaging
 */

export default function VariantArtisanal() {
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
      title: 'Deine einzigartige Strategie',
      description: 'Finde heraus, was Dich und Dein Business einzigartig macht – und wie Du das in Social Media zeigst.',
      icon: '🎯',
    },
    {
      id: 2,
      title: 'Authentische Inhalte',
      description: 'Lerne, Inhalte zu erstellen, die Deine Persönlichkeit und Deine Werte widerspiegeln.',
      icon: '✨',
    },
    {
      id: 3,
      title: 'Echte Verbindungen',
      description: 'Baue eine Community auf, die Dich wirklich versteht und unterstützt.',
      icon: '🤝',
    },
    {
      id: 4,
      title: 'Wachstum mit Sinn',
      description: 'Wachse nachhaltig, indem Du Dich treu bleibst und echte Beziehungen aufbaust.',
      icon: '🌱',
    },
    {
      id: 5,
      title: 'Von Fans zu Kunden',
      description: 'Verwandle Deine Community in loyale Kunden, die Dein Business lieben.',
      icon: '💝',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Anna Bergmann',
      company: 'Bergmann Handmade',
      text: 'Endlich ein Kurs, der nicht nur Zahlen sieht, sondern die Person hinter dem Business. Ich fühle mich verstanden und inspiriert!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Marco Rossi',
      company: 'Rossi Café',
      text: 'Die authentische Herangehensweise hat mir geholfen, meine echte Geschichte zu erzählen. Meine Kunden lieben es!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Lisa Müller',
      company: 'Müller Coaching',
      text: 'Dieser Kurs hat mir gezeigt, dass ich nicht so sein muss wie alle anderen. Meine Authentizität ist meine Stärke!',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'Ist dieser Kurs auch für mich, wenn ich neu in Social Media bin?',
      answer: 'Ja, absolut! Der Kurs ist speziell für Menschen gemacht, die neu anfangen. Wir beginnen bei den Grundlagen und bauen von dort auf – ohne technisches Jargon.',
    },
    {
      question: 'Kann ich den Kurs in meinem eigenen Tempo machen?',
      answer: 'Ja, Du hast lebenslangen Zugriff auf alle Inhalte. Du kannst in Deinem eigenen Tempo lernen – es gibt keine Fristen oder Deadlines.',
    },
    {
      question: 'Werde ich wirklich Kunden gewinnen?',
      answer: 'Ja, wenn Du die Strategien umsetzt. Viele unserer Teilnehmer berichten von neuen Kunden bereits nach wenigen Wochen. Es braucht aber Geduld und Konsistenz.',
    },
    {
      question: 'Welche Plattformen sollte ich nutzen?',
      answer: 'Wir zeigen Dir, wie Du die richtige Plattform für Dein Business wählst. Es ist besser, eine Plattform gut zu machen, als überall präsent zu sein.',
    },
    {
      question: 'Gibt es Support, wenn ich Fragen habe?',
      answer: 'Ja! Du hast Zugriff auf unsere Community, wo Du Fragen stellen kannst. Außerdem gibt es monatliche Live-Sessions, wo wir gemeinsam Fragen beantworten.',
    },
    {
      question: 'Was ist, wenn der Kurs nicht zu mir passt?',
      answer: 'Kein Problem! Wir bieten 30 Tage Geld-zurück-Garantie. Wenn es nicht passt, bekommst Du Dein Geld zurück – ohne Fragen.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#D4C4B8] text-[#2C2C2C]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#D4C4B8]/95 backdrop-blur border-b-2 border-[#C85A3A]/20">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-[#C85A3A]">ProStar</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm hover:text-[#C85A3A] transition-colors font-medium">Module</a>
            <a href="#results" className="text-sm hover:text-[#C85A3A] transition-colors font-medium">Ergebnisse</a>
            <a href="#pricing" className="text-sm hover:text-[#C85A3A] transition-colors font-medium">Preise</a>
            <a href="#faq" className="text-sm hover:text-[#C85A3A] transition-colors font-medium">FAQ</a>
          </div>
          <Button className="px-6 py-2 bg-[#C85A3A] text-white hover:bg-[#A84A2A] transition-colors">
            Jetzt starten
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b-2 border-[#C85A3A]/20">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-[#C85A3A]/10 rounded-full text-[#C85A3A] font-semibold text-sm">
              ✨ Für Unternehmer wie Du
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Social Media für Dein Business – Authentisch & Echt
            </h1>
            <p className="text-lg text-[#2C2C2C]/80 mb-8 leading-relaxed">
              Vergiss alles, was Du über "perfekte" Social Media weißt. Lerne, wie Du mit Deiner echten Persönlichkeit eine Community aufbaust, die Dein Business liebt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="px-8 py-3 bg-[#C85A3A] text-white hover:bg-[#A84A2A] font-semibold transition-colors">
                Kostenlose Mini-Lektion
              </Button>
              <Button className="px-8 py-3 border-2 border-[#C85A3A] text-[#C85A3A] hover:bg-[#C85A3A]/10 font-semibold transition-colors">
                Mehr erfahren
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C85A3A]" />
                <span>Echte Menschen, echte Geschichten</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C85A3A]" />
                <span>Keine Tricks oder Hacks – nur echte Strategien</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C85A3A]" />
                <span>Lebenslanger Zugriff + Community Support</span>
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
      <section className="py-20 md:py-32 bg-[#F5F1ED]">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Das Problem mit "Standard" Social Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-[#C85A3A]">❌ Was nicht funktioniert</h3>
                <ul className="space-y-3 text-[#2C2C2C]/80">
                  <li>• Ständig neue Trends nachmachen</li>
                  <li>• Dich selbst verleugnen für "Engagement"</li>
                  <li>• Stundenlang Content erstellen, ohne Ergebnisse</li>
                  <li>• Dich mit anderen vergleichen</li>
                  <li>• Keine echte Verbindung zu Deiner Audience</li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-[#C85A3A]">✅ Was wirklich funktioniert</h3>
                <ul className="space-y-3 text-[#2C2C2C]/80">
                  <li>• Deine echte Geschichte erzählen</li>
                  <li>• Deine Werte und Persönlichkeit zeigen</li>
                  <li>• Strategisch, aber authentisch vorgehen</li>
                  <li>• Eine Community aufbauen, nicht nur Follower</li>
                  <li>• Echte Kunden gewinnen, die Dich lieben</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 md:py-32">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Was Du lernen wirst</h2>
          <p className="text-center text-[#2C2C2C]/70 text-lg mb-16 max-w-2xl mx-auto">
            5 Module, die Dich von "Ich weiß nicht, wie ich anfangen soll" zu "Ich habe eine echte Community" bringen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="bg-[#F5F1ED] border-2 border-[#C85A3A]/20 rounded-lg p-8 hover:border-[#C85A3A] transition-all hover:shadow-lg"
              >
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                <p className="text-[#2C2C2C]/70">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 md:py-32 bg-[#F5F1ED]">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Was unsere Teilnehmer erreicht haben</h2>
          <p className="text-center text-[#2C2C2C]/70 text-lg mb-16 max-w-2xl mx-auto">
            Echte Menschen, echte Ergebnisse.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#C85A3A] mb-2">+500</div>
              <p className="text-[#2C2C2C]/70">Neue Follower im ersten Monat (durchschnittlich)</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#C85A3A] mb-2">10+</div>
              <p className="text-[#2C2C2C]/70">Neue Kunden pro Monat (durchschnittlich)</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#C85A3A] mb-2">100%</div>
              <p className="text-[#2C2C2C]/70">Würden den Kurs weiterempfehlen</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Im Kurs enthalten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="space-y-4">
                {[
                  'Video-Module (einfach erklärt)',
                  'Workbooks zum Ausfüllen',
                  'Vorlagen & Checklisten',
                  'Echte Fallstudien',
                  'Community Forum',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#C85A3A] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-4">
                {[
                  'Monatliche Live-Sessions',
                  'Bonus: Content-Kalender',
                  'Bonus: Storytelling-Guide',
                  'Lebenslanger Zugriff',
                  'Geld-zurück-Garantie',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#C85A3A] flex-shrink-0" />
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
          <h2 className="text-4xl font-bold text-center mb-16">Das sagen unsere Teilnehmer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-[#F5F1ED] rounded-lg p-8 border-l-4 border-[#C85A3A]">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#C85A3A]">★</span>
                  ))}
                </div>
                <p className="text-[#2C2C2C]/80 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-[#2C2C2C]/60">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 bg-[#F5F1ED]">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Einfache Preise</h2>
          <p className="text-center text-[#2C2C2C]/70 text-lg mb-16">Wähle den Plan, der zu Dir passt.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#D4C4B8] border-2 border-[#C85A3A]/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-[#2C2C2C]/70 mb-6">Perfekt um zu starten</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€97</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C85A3A]" />
                  <span className="text-sm">5 Video-Module</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C85A3A]" />
                  <span className="text-sm">Workbooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C85A3A]" />
                  <span className="text-sm">Lebenslanger Zugriff</span>
                </li>
              </ul>
              <Button className="w-full border-2 border-[#C85A3A] text-[#C85A3A] hover:bg-[#C85A3A]/10">
                Jetzt starten
              </Button>
            </div>
            
            <div className="bg-[#C85A3A] text-white rounded-lg p-8 relative transform md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#C85A3A] px-4 py-1 rounded-full text-sm font-semibold">
                Beliebt ⭐
              </div>
              <h3 className="text-2xl font-bold mb-2">Community</h3>
              <p className="text-white/90 mb-6">Das komplette Paket</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€197</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Alles aus Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Community Forum</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Monatliche Live-Sessions</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-[#C85A3A] hover:bg-gray-100 font-semibold">
                Jetzt starten
              </Button>
            </div>
            
            <div className="bg-[#D4C4B8] border-2 border-[#C85A3A]/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">VIP</h3>
              <p className="text-[#2C2C2C]/70 mb-6">Mit 1:1 Coaching</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€497</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C85A3A]" />
                  <span className="text-sm">Alles aus Community</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C85A3A]" />
                  <span className="text-sm">1:1 Coaching (3 Sessions)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C85A3A]" />
                  <span className="text-sm">Persönlicher Aktionsplan</span>
                </li>
              </ul>
              <Button className="w-full border-2 border-[#C85A3A] text-[#C85A3A] hover:bg-[#C85A3A]/10">
                Kontakt
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#C85A3A] text-white">
        <div className="container max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4">Bereit, Deine Geschichte zu erzählen?</h2>
          <p className="text-center text-white/90 text-lg mb-8">
            Tritt unserer Community bei und starte Deine Social-Media-Reise – authentisch und erfolgreich.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Deine E-Mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-[#C85A3A] hover:bg-gray-100 font-semibold">
              Kostenlose Mini-Lektion erhalten
            </Button>
          </form>
          
          <p className="text-center text-xs text-white/70 mt-4">
            Keine Spam, nur echte Inhalte. Abmeldung jederzeit möglich.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-4">Häufig gestellte Fragen</h2>
          <p className="text-center text-[#2C2C2C]/70 text-lg mb-12">
            Alles, was Du wissen musst.
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#F5F1ED] border-2 border-[#C85A3A]/20 rounded-lg cursor-pointer hover:border-[#C85A3A] transition-all"
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                <div className="flex items-center justify-between p-6">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C85A3A] transition-transform ${
                      activeTab === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {activeTab === index && (
                  <div className="px-6 pb-6 border-t-2 border-[#C85A3A]/20 text-[#2C2C2C]/80">
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
                Wir helfen Unternehmern, ihre echte Geschichte zu erzählen und eine Community aufzubauen.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kurse</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Social Media Masterplan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Alle Kurse</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">E-Mail</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-400 text-center">
              © 2024 ProStar Marketing. Mit ❤️ gemacht.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
