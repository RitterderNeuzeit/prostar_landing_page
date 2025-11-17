import { useState } from 'react';
import { Star, Play, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  videoUrl?: string;
  results?: string;
  verified: boolean;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Müller',
    title: 'Gründerin & Geschäftsführerin',
    company: 'Müller Consulting GmbH',
    image: '/images/testimonial-mueller.jpg',
    rating: 5,
    text: 'Der Kurs hat mein Verständnis für Social Media komplett verändert. Ich konnte meine Follower in 3 Monaten verdoppeln und gewinne jetzt regelmäßig neue Kunden über LinkedIn. Die praktischen Tipps sind sofort umsetzbar!',
    results: 'LinkedIn Follower: 200 → 1.100 | 12 neue Kunden | €85K zusätzlicher Umsatz',
    verified: true,
    date: '2024-09-15',
  },
  {
    id: 2,
    name: 'Dr. Thomas Weber',
    title: 'Rechtsanwalt & Partner',
    company: 'Weber & Partner Rechtsanwälte',
    image: '/images/testimonial-weber.jpg',
    rating: 5,
    text: 'Ich war skeptisch, ob Social Media für meine Branche funktioniert. Aber dieser Kurs hat mir gezeigt, dass Authentizität und Expertise online genauso wichtig sind. Meine Mandanten-Anfragen sind um das 8-fache gestiegen!',
    results: 'Mandanten-Anfragen: 2 → 16 pro Monat | 35% Conversion Rate',
    verified: true,
    date: '2024-08-22',
  },
  {
    id: 3,
    name: 'Julia Schmidt',
    title: 'Gründerin',
    company: 'Schmidt Design Studio',
    image: '/images/testimonial-schmidt.jpg',
    rating: 5,
    text: 'Großartig strukturiert und voller actionabler Tipps. Der Kurs hat mir geholfen, meine Arbeiten nicht nur zu zeigen, sondern zu verkaufen. Instagram ist jetzt mein wichtigster Kundenkanal!',
    results: 'Instagram Follower: 800 → 3.040 | 25 Anfragen/Monat | €120K zusätzlich',
    verified: true,
    date: '2024-09-01',
  },
  {
    id: 4,
    name: 'Anna Bergmann',
    title: 'Inhaberin',
    company: 'Bergmann Handmade GmbH',
    image: '/images/testimonial-bergmann.jpg',
    rating: 5,
    text: 'Endlich ein Kurs, der nicht nur Zahlen sieht, sondern die Person hinter dem Business. Ich fühle mich verstanden und inspiriert. Meine Online-Verkäufe sind um 340% gestiegen!',
    results: 'Verkäufe: €12K → €53K monatlich | 68% Wiederholungskäufer',
    verified: true,
    date: '2024-08-10',
  },
  {
    id: 5,
    name: 'Marco Rossi',
    title: 'Café-Besitzer',
    company: 'Rossi Café & Bakery',
    image: '/images/testimonial-rossi.jpg',
    rating: 5,
    text: 'Ich dachte, Social Media ist nicht für lokale Cafés. Aber der Kurs zeigte mir, wie ich meine Community online engagieren und offline in mein Café bringen kann. Genial!',
    results: 'Tägliche Besucher: 120 → 198 | €45K zusätzlicher Umsatz',
    verified: true,
    date: '2024-07-28',
  },
  {
    id: 6,
    name: 'Lisa Hoffmann',
    title: 'Coach & Trainerin',
    company: 'Hoffmann Coaching',
    image: '/images/testimonial-hoffmann.jpg',
    rating: 5,
    text: 'Dieser Kurs hat mir gezeigt, dass ich nicht so sein muss wie alle anderen. Meine Authentizität ist meine Stärke. Meine Kunden lieben meine echte Art und buchen schneller.',
    results: 'Buchungsrate: +180% | Durchschnittlicher Kundenwert: +45%',
    verified: true,
    date: '2024-09-05',
  },
];

interface EnhancedTestimonialsProps {
  variant?: 'warm-minimal' | 'professional' | 'artisanal';
  limit?: number;
}

export default function EnhancedTestimonials({
  variant = 'warm-minimal',
  limit = 6,
}: EnhancedTestimonialsProps) {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const getVariantClasses = () => {
    switch (variant) {
      case 'professional':
        return {
          container: 'bg-white',
          heading: 'text-gray-900',
          subheading: 'text-gray-600',
          card: 'bg-white border border-gray-200 hover:border-[#6B8E5F]',
          accent: 'text-[#6B8E5F]',
          badge: 'bg-[#6B8E5F]/10 text-[#6B8E5F]',
          quote: 'text-gray-700',
          results: 'text-gray-600',
        };
      case 'artisanal':
        return {
          container: 'bg-[#F5F1ED]',
          heading: 'text-[#2C2C2C]',
          subheading: 'text-[#2C2C2C]/70',
          card: 'bg-[#D4C4B8] border-2 border-[#C85A3A]/20 hover:border-[#C85A3A]',
          accent: 'text-[#C85A3A]',
          badge: 'bg-[#C85A3A]/10 text-[#C85A3A]',
          quote: 'text-[#2C2C2C]/80',
          results: 'text-[#2C2C2C]/70',
        };
      default: // warm-minimal
        return {
          container: 'bg-background',
          heading: 'text-foreground',
          subheading: 'text-muted-foreground',
          card: 'card',
          accent: 'text-accent',
          badge: 'bg-accent/10 text-accent',
          quote: 'text-foreground',
          results: 'text-muted-foreground',
        };
    }
  };

  const classes = getVariantClasses();
  const displayedTestimonials = testimonials.slice(0, limit);

  return (
    <section className={`py-20 md:py-32 ${classes.container}`}>
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${classes.heading}`}>
            Vertraut von über 500 Unternehmern
          </h2>
          <p className={`text-lg ${classes.subheading}`}>
            Lesen Sie, was echte Kursteilnehmer über ihre Erfahrungen sagen.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`${classes.card} rounded-lg p-6 md:p-8 hover:shadow-lg transition-all duration-300`}
            >
              {/* Header with Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className={`font-bold text-lg ${classes.accent}`}>
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${classes.heading}`}>{testimonial.name}</h3>
                  <p className={`text-sm ${classes.subheading}`}>{testimonial.title}</p>
                  <p className={`text-xs ${classes.subheading}`}>{testimonial.company}</p>
                </div>
                {testimonial.verified && (
                  <div className={`${classes.badge} px-2 py-1 rounded text-xs font-semibold`}>
                    ✓ Verifiziert
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 fill-current ${classes.accent}`}
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="mb-4">
                <Quote className={`w-5 h-5 ${classes.accent} mb-2 opacity-50`} />
                <p className={`italic ${classes.quote} leading-relaxed`}>
                  "{testimonial.text}"
                </p>
              </div>

              {/* Results */}
              {testimonial.results && (
                <div className={`mb-4 p-3 rounded ${variant === 'professional' ? 'bg-gray-100' : variant === 'artisanal' ? 'bg-[#C85A3A]/10' : 'bg-accent/10'}`}>
                  <p className={`text-xs font-semibold ${classes.accent} mb-1`}>Ergebnisse:</p>
                  <p className={`text-xs ${classes.results}`}>{testimonial.results}</p>
                </div>
              )}

              {/* Date */}
              <p className={`text-xs ${classes.subheading}`}>
                {new Date(testimonial.date).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className={`mt-16 pt-16 border-t ${variant === 'professional' ? 'border-gray-200' : variant === 'artisanal' ? 'border-[#C85A3A]/20' : 'border-border'}`}>
          <h3 className={`text-3xl font-bold text-center mb-12 ${classes.heading}`}>
            Video-Testimonials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: 'Sarah Müller',
                title: 'Wie ich meine LinkedIn-Präsenz aufgebaut habe',
                duration: '3:45',
              },
              {
                id: 2,
                name: 'Julia Schmidt',
                title: 'Von 800 zu 3.000 Instagram Followern',
                duration: '4:12',
              },
              {
                id: 3,
                name: 'Anna Bergmann',
                title: 'Wie Authentizität meine Verkäufe verändert hat',
                duration: '3:28',
              },
            ].map((video) => (
              <div
                key={video.id}
                className={`${classes.card} rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300`}
                onClick={() => setSelectedVideo(video.id)}
              >
                <div className="relative w-full aspect-video bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-colors">
                  <Play className={`w-12 h-12 ${classes.accent} group-hover:scale-110 transition-transform`} />
                </div>
                <div className="p-4">
                  <p className={`font-semibold ${classes.heading}`}>{video.name}</p>
                  <p className={`text-sm ${classes.subheading} mb-2`}>{video.title}</p>
                  <p className={`text-xs ${classes.subheading}`}>{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className={`mt-16 pt-16 border-t ${variant === 'professional' ? 'border-gray-200' : variant === 'artisanal' ? 'border-[#C85A3A]/20' : 'border-border'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className={`text-3xl font-bold ${classes.accent} mb-2`}>500+</div>
              <p className={`${classes.subheading}`}>Zufriedene Teilnehmer</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${classes.accent} mb-2`}>98%</div>
              <p className={`${classes.subheading}`}>Zufriedenheitsrate</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${classes.accent} mb-2`}>4.9/5</div>
              <p className={`${classes.subheading}`}>Durchschnittliche Bewertung</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${classes.accent} mb-2`}>€2.5M+</div>
              <p className={`${classes.subheading}`}>Zusätzlicher Umsatz</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
