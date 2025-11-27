import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";

export default function FreeCourseIntro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess(data) {
      if (data.emailSent) {
        toast.success("Zugangscode gesendet – bitte Posteingang prüfen.");
      } else {
        toast.warning(
          data.emailError ||
            "Registrierung erstellt, aber E-Mail Versand nicht aktiv."
        );
      }
    },
    onError(err) {
      toast.error(err.message || "Fehler bei Registrierung");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    createRegistration.mutate({ name, email });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="container max-w-3xl">
        <h1 className="text-5xl font-bold mb-6">Kostenloser Kurs Zugang</h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Starte jetzt mit unserem kostenlosen Einführungsmodul. Du erhältst
          einen persönlichen Zugangscode per E-Mail (gültig für 90 Tage).
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="space-y-4">
            {["Sofort starten", "Praxisorientierte Inhalte", "Keine Zahlung nötig"].map(item => (
              <div key={item} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Dein Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Vorname oder Spitzname"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Deine E-Mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="du@example.com"
                required
              />
            </div>
            <Button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={createRegistration.isPending}
            >
              {createRegistration.isPending ? "Wird gesendet..." : "Gratis Zugang anfordern"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            {createRegistration.data?.accessKey && !createRegistration.data.emailSent && (
              <p className="text-xs text-muted-foreground">
                Dein Code: <code>{createRegistration.data.accessKey}</code>
              </p>
            )}
          </form>
        </div>

        <div className="text-sm text-muted-foreground">
          Mit deiner Anmeldung stimmst du zu, Kurs-Updates per E-Mail zu erhalten. Abmeldung jederzeit möglich.
        </div>
      </div>
    </div>
  );
}
