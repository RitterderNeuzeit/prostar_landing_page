import React, { useEffect, useState, useRef } from 'react';

function Header({ onExit }: { onExit: () => void }) {
  return (
    <div className="container flex items-center justify-between py-4">
      <div className="text-2xl font-bold">ProStar — Admin</div>
      <div className="flex items-center gap-2">
        <button className="btn-tertiary" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [key, setKey] = useState<string>(sessionStorage.getItem('admin_key') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any>(null);
  const inactivityTimer = useRef<number | null>(null);

  useEffect(() => {
    sessionStorage.setItem('admin_key', key);
  }, [key]);

  useEffect(() => {
    startInactivityTimer();
    return () => stopInactivityTimer();
  }, []);

  function startInactivityTimer() {
    stopInactivityTimer();
    inactivityTimer.current = window.setTimeout(() => {
      sessionStorage.removeItem('admin_key');
      setKey('');
      setMessage('Session expired due to inactivity');
    }, 15 * 60 * 1000); // 15 min
  }

  function stopInactivityTimer() {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }

  function refreshActivity() {
    startInactivityTimer();
  }

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/landing', { headers: { 'x-admin-key': key } });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setData(json);
      setMessage('Loaded');
    } catch (err: any) {
      setMessage('Load error: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setLoading(true);
    setMessage('');
    try {
      const payload = data;
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Status ${res.status}`);
      }
      setMessage('Saved successfully');
    } catch (err: any) {
      setMessage('Save error: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  function onExit() {
    sessionStorage.removeItem('admin_key');
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-background text-foreground" onMouseMove={refreshActivity} onKeyDown={refreshActivity}>
      <Header onExit={onExit} />
      <div className="container py-8">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Admin Key</label>
          <input value={key} onChange={e => setKey(e.target.value)} className="w-full p-2 rounded border" />
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={load} className="btn-primary" disabled={loading}>Load</button>
          <button onClick={save} className="btn-secondary" disabled={loading}>Save</button>
          <button onClick={onExit} className="btn-outline">Exit</button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Brand</label>
          <input className="w-full p-2 rounded border mb-2" value={data?.brand?.title || ''} onChange={e => setData({ ...data, brand: { ...(data?.brand || {}), title: e.target.value } })} placeholder="Title" />
          <input className="w-full p-2 rounded border mb-2" value={data?.brand?.headline || ''} onChange={e => setData({ ...data, brand: { ...(data?.brand || {}), headline: e.target.value } })} placeholder="Headline" />
          <input className="w-full p-2 rounded border" value={data?.brand?.subheadline || ''} onChange={e => setData({ ...data, brand: { ...(data?.brand || {}), subheadline: e.target.value } })} placeholder="Subheadline" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Primary CTA</label>
          <input className="w-full p-2 rounded border mb-2" value={data?.ctas?.primary?.label || ''} onChange={e => setData({ ...data, ctas: { ...(data?.ctas || {}), primary: { ...(data?.ctas?.primary || {}), label: e.target.value } } })} placeholder="Primary label" />
          <input className="w-full p-2 rounded border" value={data?.ctas?.primary?.href || ''} onChange={e => setData({ ...data, ctas: { ...(data?.ctas || {}), primary: { ...(data?.ctas?.primary || {}), href: e.target.value } } })} placeholder="Primary href" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Modules (first 3)</label>
          {(data?.modules || []).slice(0, 3).map((m: any, idx: number) => (
            <div key={idx} className="mb-2 p-2 border rounded">
              <input className="w-full p-2 rounded border mb-2" value={m.title || ''} onChange={e => {
                const modules = [...(data?.modules || [])];
                modules[idx] = { ...(modules[idx] || {}), title: e.target.value };
                setData({ ...data, modules });
              }} placeholder={`Module ${idx + 1} title`} />
              <input className="w-full p-2 rounded border" value={m.description || ''} onChange={e => {
                const modules = [...(data?.modules || [])];
                modules[idx] = { ...(modules[idx] || {}), description: e.target.value };
                setData({ ...data, modules });
              }} placeholder={`Module ${idx + 1} description`} />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Raw JSON (preview)</label>
          <pre className="w-full p-3 rounded border bg-card text-sm overflow-auto" style={{ maxHeight: 320 }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div className="text-sm text-muted-foreground">{message}</div>
      </div>
    </div>
  );
}
