# ProStar Kurs-Portal - Squarespace Integration Code

## 🎯 Setup-Anleitung

### Schritt 1: Railway App URL ermitteln

Nach dem Deployment auf Railway erhältst du eine URL wie:
```
https://prostar-production-abc123.up.railway.app
```

Notiere diese URL.

### Schritt 2: Code für Squarespace vorbereiten

Wähle eine der folgenden Methoden:

---

## ✅ Methode 1: Vollbild-Iframe (Empfohlen)

### Für: Eine dedizierte Seite auf `kursprostarmarketing.squarespace.com`

**In Squarespace:**

1. Gehe zu **Pages** → Füge neue Seite hinzu
2. Name: "Kurs-Zugang" oder "Kurs-Portal"
3. Füge einen **Code Block** hinzu
4. Kopiere folgenden Code:

```html
<!-- ProStar Kurs-Portal - Vollbild Integration -->
<style>
  /* Hide Squarespace Header/Footer */
  body { margin: 0; padding: 0; overflow: hidden; }
  #header, #footer, .sqs-announcement-bar { display: none !important; }
  
  /* Loading Animation */
  .prostar-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    transition: opacity 0.5s;
  }
  
  .prostar-loading.hide { opacity: 0; pointer-events: none; }
  
  .prostar-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .prostar-loading-text {
    margin-top: 20px;
    color: white;
    font-size: 18px;
    font-weight: 500;
  }
  
  /* Iframe Styling */
  #prostar-kurs-iframe {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border: none;
    z-index: 999998;
  }
</style>

<!-- Loading Overlay -->
<div class="prostar-loading" id="prostar-loading">
  <div class="prostar-spinner"></div>
  <div class="prostar-loading-text">ProStar Kurs-Portal lädt...</div>
</div>

<!-- Main Iframe -->
<iframe 
  id="prostar-kurs-iframe"
  src="https://your-app-xyz.up.railway.app"
  allow="camera; microphone; payment; clipboard-write"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
  loading="eager">
</iframe>

<script>
(function() {
  const iframe = document.getElementById('prostar-kurs-iframe');
  const loading = document.getElementById('prostar-loading');
  
  // Replace with your Railway URL
  const RAILWAY_URL = 'https://your-app-xyz.up.railway.app';
  iframe.src = RAILWAY_URL;
  
  // Hide loading when loaded
  iframe.addEventListener('load', function() {
    setTimeout(() => loading.classList.add('hide'), 500);
  });
  
  // Fallback timeout
  setTimeout(() => loading.classList.add('hide'), 10000);
  
  // Error handling
  iframe.addEventListener('error', function() {
    loading.innerHTML = '<div style="color:white;text-align:center;"><h2>⚠️ Verbindungsfehler</h2><p>Bitte später erneut versuchen.</p></div>';
  });
})();
</script>
```

5. **WICHTIG:** Ersetze `https://your-app-xyz.up.railway.app` mit deiner Railway-URL (2x im Code)
6. Speichern und Veröffentlichen

---

## ✅ Methode 2: Code Injection (Ganze Site)

### Für: Alle Seiten auf `kursprostarmarketing.squarespace.com`

**In Squarespace:**

1. Gehe zu **Settings** → **Advanced** → **Code Injection**
2. **Header** Tab:

```html
<style>
  /* Hide Squarespace UI for clean app */
  #header, #footer, .sqs-announcement-bar { display: none !important; }
  body { margin: 0; padding: 0; }
</style>
```

3. **Footer** Tab:

```html
<div id="prostar-app-root"></div>
<script>
(function() {
  const container = document.getElementById('prostar-app-root');
  
  // Railway URL - ÄNDERN SIE DIES!
  const RAILWAY_URL = 'https://your-app-xyz.up.railway.app';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = RAILWAY_URL;
  iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:999999';
  iframe.allow = 'camera; microphone; payment; clipboard-write';
  iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals';
  
  container.appendChild(iframe);
  
  // Loading indicator
  const loading = document.createElement('div');
  loading.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#667eea;font-size:20px;z-index:999998';
  loading.textContent = 'Lädt...';
  document.body.appendChild(loading);
  
  iframe.onload = () => loading.remove();
})();
</script>
```

4. **WICHTIG:** Ersetze `https://your-app-xyz.up.railway.app` mit deiner Railway-URL
5. Speichern und Veröffentlichen

---

## ✅ Methode 3: Responsive Embed (Mit Squarespace Header/Footer)

### Für: Eingebettetes Portal mit Squarespace-Navigation

**In Squarespace (Code Block):**

```html
<!-- ProStar Kurs-Portal - Responsive Embed -->
<style>
  .prostar-embed-container {
    width: 100%;
    max-width: 1400px;
    margin: 40px auto;
    padding: 0 20px;
  }
  
  .prostar-embed-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 75%; /* 4:3 Aspect Ratio */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
  
  .prostar-embed-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  
  @media (max-width: 768px) {
    .prostar-embed-wrapper {
      padding-bottom: 100%; /* Square on mobile */
    }
  }
</style>

<div class="prostar-embed-container">
  <h2 style="text-align: center; margin-bottom: 30px; font-size: 32px;">
    🎓 ProStar Kurs-Portal
  </h2>
  
  <div class="prostar-embed-wrapper">
    <iframe 
      class="prostar-embed-iframe"
      src="https://your-app-xyz.up.railway.app"
      allow="camera; microphone; payment"
      loading="lazy">
    </iframe>
  </div>
  
  <p style="text-align: center; margin-top: 20px; color: #666;">
    Vollbild-Modus für beste Erfahrung empfohlen
  </p>
</div>
```

---

## 🔧 Wichtige Einstellungen

### Railway Environment-Variablen

In Railway Dashboard → Variables setzen:

```env
NODE_ENV=production
SITE_URL=https://kursprostarmarketing.squarespace.com
OAUTH_SERVER_URL=https://your-app-xyz.up.railway.app
COOKIE_SECURE=true
PORT=3000

# Deine anderen Variablen aus .env.example
DATABASE_URL=mysql://...
JWT_SECRET=your-secret
EMAIL_USER=...
STRIPE_SECRET_KEY=...
```

### Testing Checklist

Nach dem Setup:

- [ ] `https://kursprostarmarketing.squarespace.com` lädt
- [ ] Iframe wird angezeigt (keine CORS-Fehler)
- [ ] Landing Page ist sichtbar
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Cookies werden gesetzt (check DevTools)
- [ ] Email-Versand funktioniert
- [ ] Mobile/Tablet funktioniert

---

## 🐛 Troubleshooting

### Iframe lädt nicht

**Browser Console (F12) prüfen:**

```
Blocked by CORS → Server CORS config prüfen
X-Frame-Options → CSP Header prüfen
Cookie not set → sameSite='none' und secure=true prüfen
```

### Cookies funktionieren nicht

**In Safari/Chrome mit strict settings:**

Cookies in iframes werden oft blockiert. Lösung:

1. Verwende Token-basierte Auth (JWT in LocalStorage)
2. Oder: Benutzer zu direkter Railway-URL redirecten für Login

### Railway URL ändern

1. Railway Dashboard → Settings → Domains
2. Custom Domain hinzufügen
3. CNAME in DNS: `kurs-backend.prostarmarketing.de` → `your-app.up.railway.app`
4. Code überall aktualisieren

---

## 📚 Weitere Ressourcen

- [Railway Dokumentation](https://docs.railway.app)
- [Squarespace Code Injection](https://support.squarespace.com/hc/en-us/articles/205815908)
- [CORS Debugging](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

**Support:** Siehe `docs/SQUARESPACE_SUBDOMAIN_DEPLOYMENT.md` für vollständige Anleitung
