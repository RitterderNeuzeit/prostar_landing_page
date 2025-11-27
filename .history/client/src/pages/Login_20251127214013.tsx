import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess(data) {
      if (data.success) {
        toast.success('Login erfolgreich');
        setTimeout(() => {
          window.location.href = '/course';
        }, 500);
      } else {
        toast.error(data.error || 'Login fehlgeschlagen');
      }
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-lg shadow-lg border bg-card">
          <div className="bg-gradient-to-r from-accent to-accent/70 px-6 py-4">
            <h1 className="text-xl font-semibold text-white">Anmelden</h1>
            <p className="text-sm text-white/80">Greife auf deinen Kurs zu</p>
          </div>
          <div className="p-6 space-y-6">
            {isAuthenticated && (
              <p className="text-sm text-muted-foreground">
                Du bist bereits angemeldet.
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">E-Mail</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="du@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Passwort</label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loginMutation.isPending ? 'Wird geprüft...' : 'Einloggen'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
            <div className="text-xs text-muted-foreground">
              Noch keinen Zugang? <a href="/kostenloser-kurs" className="underline">Gratis starten</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
