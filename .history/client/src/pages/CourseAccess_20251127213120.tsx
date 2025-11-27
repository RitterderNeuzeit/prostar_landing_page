import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CourseAccess() {
  const [step, setStep] = useState<'verify' | 'password' | 'done'>('verify');
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const verifyMutation = trpc.registration.verify.useMutation({
    onSuccess(data) {
      if (data.valid) {
        toast.success('Code verifiziert – Passwort setzen');
        setStep('password');
        if (data.name) setName(data.name);
      } else {
        toast.error(data.error || 'Ungültiger Code');
      }
    },
    onError(err) { toast.error(err.message); },
  });

  const finalizeMutation = trpc.registration.finalize.useMutation({
    onSuccess(data) {
      if (data.success) {
        toast.success('Account erstellt – Kurs freigeschaltet');
        setStep('done');
      } else {
        toast.error(data.error || 'Fehler bei Finalisierung');
      }
    },
    onError(err) { toast.error(err.message); },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({ email, accessKey });
  };
  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    finalizeMutation.mutate({ email, accessKey, password, name });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="container max-w-lg">
        <h1 className="text-4xl font-bold mb-6">Kurszugang</h1>
        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">E-Mail</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Zugangscode</label>
              <Input value={accessKey} onChange={e => setAccessKey(e.target.value)} required />
            </div>
            <Button type="submit" disabled={verifyMutation.isPending} className="btn-primary w-full">
              {verifyMutation.isPending ? 'Prüfe...' : 'Code verifizieren'}
            </Button>
          </form>
        )}
        {step === 'password' && (
          <form onSubmit={handleFinalize} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name (optional)</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Passwort (min. 8 Zeichen)</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={finalizeMutation.isPending} className="btn-primary w-full">
              {finalizeMutation.isPending ? 'Speichere...' : 'Account erstellen & Kurs starten'}
            </Button>
          </form>
        )}
        {step === 'done' && (
          <div className="space-y-4">
            <p>Dein Zugang ist aktiv. Du kannst jetzt mit dem Kurs beginnen.</p>
            <a href="/course">
              <Button type="button" className="btn-secondary w-full">Zum Kurs</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
