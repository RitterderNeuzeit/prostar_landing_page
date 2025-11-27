import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [formStartTime] = useState(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const requestMutation = trpc.passwordReset.request.useMutation({
    onSuccess: () => {
      toast({
        title: "E-Mail gesendet",
        description: "Wenn ein Konto mit dieser E-Mail existiert, haben Sie eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts erhalten.",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypotRef.current && honeypotRef.current.value !== "") {
      console.warn("Honeypot triggered");
      return;
    }

    // Timing check (min 1.5s to prevent bots)
    const fillTime = Date.now() - formStartTime;
    if (fillTime < 1500) {
      console.warn("Form filled too quickly");
      return;
    }

    // Get captcha token (placeholder for now)
    const captchaToken = undefined; // TODO: Implement reCAPTCHA/hCaptcha frontend

    requestMutation.mutate({
      email,
      captchaToken,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-accent to-accent/70 text-white py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <a className="text-2xl font-bold">ProStar AI</a>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Passwort vergessen?</h1>
            <p className="text-muted-foreground">
              Geben Sie Ihre E-Mail-Adresse ein, um ein neues Passwort anzufordern.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={requestMutation.isPending}
              />
            </div>

            {/* Honeypot field (hidden) */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
              }}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending ? "Sende..." : "Passwort zurücksetzen"}
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            <Link href="/login">
              <a className="text-accent hover:underline">
                Zurück zum Login
              </a>
            </Link>
            <div className="text-muted-foreground">
              Noch kein Konto?{" "}
              <Link href="/kostenloser-kurs">
                <a className="text-accent hover:underline">
                  Kostenlos registrieren
                </a>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
