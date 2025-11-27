import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [formStartTime] = useState(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlEmail = params.get("email");
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, []);

  const resetMutation = trpc.passwordReset.reset.useMutation({
    onSuccess: () => {
      toast({
        title: "Passwort erfolgreich zurückgesetzt",
        description: "Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Bitte stellen Sie sicher, dass beide Passwörter identisch sind.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      toast({
        title: "Passwort zu kurz",
        description: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        variant: "destructive",
      });
      return;
    }

    // Honeypot check
    if (honeypotRef.current && honeypotRef.current.value !== "") {
      console.warn("Honeypot triggered");
      return;
    }

    // Timing check
    const fillTime = Date.now() - formStartTime;
    if (fillTime < 2000) {
      console.warn("Form filled too quickly");
      return;
    }

    // Get captcha token (placeholder)
    const captchaToken = undefined; // TODO: Implement reCAPTCHA/hCaptcha frontend

    resetMutation.mutate({
      token,
      newPassword,
      captchaToken,
    });
  };

  if (!token) {
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

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 space-y-6 text-center">
            <h1 className="text-2xl font-bold">Ungültiger Link</h1>
            <p className="text-muted-foreground">
              Dieser Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.
            </p>
            <Link href="/forgot-password">
              <a>
                <Button className="w-full">
                  Neuen Link anfordern
                </Button>
              </a>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Neues Passwort setzen</h1>
            {email && (
              <p className="text-muted-foreground">
                Für: {email}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mindestens 8 Zeichen"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                disabled={resetMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Passwort wiederholen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={resetMutation.isPending}
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
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Speichere..." : "Passwort speichern"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <Link href="/login">
              <a className="text-accent hover:underline">
                Zurück zum Login
              </a>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
