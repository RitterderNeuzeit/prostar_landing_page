# Handouts: Templates, Checklisten & Prompt-Vorlagen

Dieses Dokument enthält alle wichtigen Vorlagen, Checklisten und Prompt-Snippets, die im Kurs "Von Zero zum KI-Profi" erwähnt werden. Sie können diese direkt kopieren und für Ihre eigenen Projekte anpassen.

---

## Modul 1 & 2: Grundlagen des Promptings

### KAAB-Formel Template

Verwenden Sie diese Struktur, um sicherzustellen, dass Ihre Prompts immer alle notwendigen Informationen enthalten.

```markdown
**K - Kontext:**
[Beschreiben Sie hier die Ausgangssituation, das Hintergrundwissen und das übergeordnete Ziel. Geben Sie der KI alle relevanten Informationen, die sie benötigt, um die Aufgabe zu verstehen.]

**A - Aufgabe:**
[Formulieren Sie hier die genaue Aufgabe, die die KI erledigen soll. Verwenden Sie ein klares, aktives Verb (z.B. "Erstelle", "Analysiere", "Verfasse", "Fasse zusammen").]

**A - Anweisung:**
[Definieren Sie hier die Details des gewünschten Outputs. Geben Sie Anweisungen zu Tonfall, Stil, Länge, Format und der Perspektive, aus der geschrieben werden soll.]

**B - Beispiel:**
[Fügen Sie hier ein oder zwei konkrete Beispiele für den gewünschten Output ein. Zeigen Sie der KI genau, wie das Ergebnis aussehen soll. Dies ist besonders wichtig für spezifische Formate oder Stile.]
```

### Rolle-Finder-Checkliste

Eine präzise Rolle ist der größte Hebel für qualitativ hochwertigen Output. Beantworten Sie diese Fragen, um eine starke Rolle für die KI zu definieren.

- **Beruf/Expertise:** Welchen Beruf oder welche Expertenrolle soll die KI einnehmen? (z.B. "Marketingdirektor", "Wissenschaftsjournalist", " erfahrener Softwareentwickler")
- **Erfahrungslevel:** Wie viel Erfahrung hat die KI in dieser Rolle? (z.B. "...mit 15 Jahren Erfahrung in...")
- **Spezialisierung:** Auf welches Gebiet ist die KI spezialisiert? (z.B. "...spezialisiert auf B2B-SaaS-Unternehmen.")
- **Arbeitgeber/Kontext:** Für welches fiktive Unternehmen oder in welchem Kontext arbeitet die KI? (z.B. "...arbeitet für eine führende Innovationsberatung.")
- **Tonfall & Stil:** Welchen Kommunikationsstil pflegt die KI? (z.B. "professionell und datengestützt", "kreativ und inspirierend", "einfach und für Laien verständlich")
- **Ziel:** Was ist das übergeordnete Ziel der KI in dieser Rolle? (z.B. "...ihr Ziel ist es, komplexe Themen einfach zu erklären.")

**Beispiel für eine starke Rolle:**

> "Du bist ein erfahrener Wirtschaftsjournalist mit über 20 Jahren Erfahrung bei einer großen deutschen Tageszeitung. Du bist darauf spezialisiert, komplexe technologische Themen für ein nicht-technisches Publikum verständlich aufzubereiten. Dein Stil ist analytisch, aber zugänglich und du verwendest gerne Metaphern, um deine Punkte zu verdeutlichen."

### Kontext-Absatz-Vorlage

Schreiben Sie einen wiederverwendbaren Kontext-Absatz für sich oder Ihr Unternehmen. Diesen können Sie am Anfang vieler Prompts einfügen, um der KI schnell das nötige Hintergrundwissen zu geben.

```markdown
**Über mein Unternehmen:**
Mein Unternehmen, [Ihr Firmenname], ist ein [Branche]-Unternehmen mit Sitz in [Ihr Standort]. Wir haben [Anzahl] Mitarbeiter und unsere Mission ist es, [Ihre Mission].

**Meine Rolle:**
Ich bin [Ihre Position] und zu meinen Hauptaufgaben gehören [Ihre Hauptaufgaben].

**Unsere Zielgruppe:**
Unsere primäre Zielgruppe sind [Beschreibung Ihrer Zielgruppe], die vor allem Wert auf [wichtigste Werte/Bedürfnisse der Zielgruppe] legen.

**Unsere Produkte/Dienstleistungen:**
Wir bieten [Ihre Hauptprodukte/-dienstleistungen] an. Unser Alleinstellungsmerkmal ist [Ihr USP].

**Mein Ziel mit KI:**
Ich möchte KI nutzen, um [Ihr primäres Ziel, z.B. die Effizienz im Marketing zu steigern, bessere Blog-Artikel zu schreiben, etc.].
```

---

## Modul 3: Fortgeschrittene Techniken

### Chain-of-Thought (CoT) Schritt-Vorlage

Nutzen Sie diese Vorlage, um die KI bei logischen oder analytischen Aufgaben zu besseren Ergebnissen zu führen.

```markdown
**Frage/Problem:**
[Formulieren Sie hier Ihre komplexe Frage oder das Problem.]

**Anweisung:**
Denke Schritt für Schritt nach, um die Lösung zu finden. Lege deinen Denkprozess offen, bevor du die endgültige Antwort gibst.

**Erwarteter Output-Stil:**

1.  **Schritt 1:** [Erster logischer Schritt zur Lösung]
2.  **Schritt 2:** [Zweiter logischer Schritt]
3.  **Schritt n:** [Weitere Schritte...]
4.  **Endgültige Antwort:** [Die zusammengefasste, finale Antwort basierend auf den Schritten.]
```

### Tree-of-Thought (ToT) Branch-Vorlage

Verwenden Sie diese Struktur für strategische oder kreative Aufgaben, bei denen mehrere Lösungswege exploriert und bewertet werden sollen.

```markdown
**Problem/Herausforderung:**
[Beschreiben Sie hier das strategische oder kreative Problem, für das Sie Lösungen suchen.]

**Anweisung:**
Nutze den Tree-of-Thought-Ansatz, um dieses Problem zu lösen.

1.  **Generiere 3 verschiedene Lösungsansätze (Äste).** Beschreibe jeden Ansatz klar.
2.  **Bewerte jeden Ansatz.** Analysiere die jeweiligen Vor- und Nachteile.
3.  **Triff eine Entscheidung.** Wähle den besten Ansatz aus und begründe deine Wahl.
4.  **Arbeite den gewählten Ansatz weiter aus.** Skizziere die ersten konkreten Schritte zur Umsetzung.
```

---

## Modul 4 & 5: Automation & Workflows

### ICQO-Framework für Agenten-Prompts

Diese Struktur eignet sich für komplexe Prompts, mit denen Sie einen KI-Agenten steuern, der einen ganzen Prozess managen soll.

```markdown
**I - Instruktion:**
[Definieren Sie die Rolle und die übergeordnete Mission des KI-Agenten. Beispiel: "Du bist ein autonomer Agent für Lead-Qualifizierung."]

**C - Kontext:**
[Stellen Sie alle notwendigen Informationen, Regeln, Guardrails und Wissensdokumente bereit, die der Agent für seine Mission benötigt.]

**Q - Question (Herausforderung):**
[Formulieren Sie das spezifische, komplexe Ziel, das der Agent erreichen soll. Beispiel: "Analysiere die folgende Liste von 100 Leads und erstelle eine priorisierte Liste der Top 10, die am ehesten zu Kunden werden."]

**O - Output:**
[Beschreiben Sie detailliert das Format und die Struktur des gewünschten Endergebnisses. Beispiel: "Das Ergebnis soll eine Tabelle im Markdown-Format sein mit den Spalten: Firmenname, Qualifizierungs-Score (1-100), Begründung, Nächster Schritt."]
```

### Lead-Qualifizierungs-Prompt (BANT)

Ein sofort einsetzbarer Prompt, um einen Lead anhand des BANT-Frameworks zu qualifizieren.

```markdown
**Rolle:**
Du bist ein B2B Sales Development Representative mit 10 Jahren Erfahrung in der Software-Branche, spezialisiert auf die Qualifizierung von Inbound-Leads.

**Kontext:**
Dein Ziel ist es, den folgenden Lead zu qualifizieren, um festzustellen, ob er gut zu unserem CRM-Produkt passt. Nutze dafür das BANT-Framework (Budget, Authority, Need, Timeline).

**Daten des Leads:**

- **Name:** [Name des Kontakts]
- **Firma:** [Firmenname]
- **Website:** [URL der Website]
- **Position:** [Position des Kontakts]
- **Nachricht:** [Original-Nachricht des Leads]

**Aufgabe:**

1.  Besuche die Website des Leads, um das Geschäftsmodell und die Größe des Unternehmens zu verstehen.
2.  Analysiere die Position des Kontakts, um seine wahrscheinliche Entscheidungskompetenz (Authority) einzuschätzen.
3.  Bewerte die Nachricht des Leads, um den Bedarf (Need) und die Dringlichkeit (Timeline) zu identifizieren.
4.  Fasse deine Analyse in einer BANT-Bewertung zusammen. Gib für jedes der vier Kriterien eine Punktzahl von 1 (schwach) bis 10 (stark) und eine kurze Begründung.
5.  Gib eine abschließende Empfehlung ab, ob dieser Lead mit hoher, mittlerer oder niedriger Priorität weiterverfolgt werden sollte.

**Output-Format:**

- **Budget:** [Score 1-10] - [Begründung]
- **Authority:** [Score 1-10] - [Begründung]
- **Need:** [Score 1-10] - [Begründung]
- **Timeline:** [Score 1-10] - [Begründung]
- **Gesamt-Score:** [Summe der Scores]
- **Empfehlung:** [Hohe/Mittlere/Niedrige Priorität]
```

### Content-Engine-Prompt

Ein Master-Prompt, um aus einer Idee viele verschiedene Content-Varianten zu erstellen.

```markdown
**Rolle:**
Du bist eine Content-Creation-Maschine. Deine Aufgabe ist es, aus einer zentralen Idee eine Vielzahl von Content-Formaten für verschiedene Kanäle zu erstellen. Du hältst dich dabei strikt an unsere Markenstimme.

**Kontext (Unsere Brand Voice):**

- **Stil:** [z.B. informativ, unterhaltsam, inspirierend]
- **Ton:** [z.B. professionell, locker, humorvoll]
- **Zielgruppe:** [Beschreibung der Zielgruppe]
- **Tabu-Wörter:** [Wörter, die nicht verwendet werden sollen]

**Aufgabe:**
Nimm die folgende Kernidee und generiere daraus die unten spezifizierten Content-Assets. Sorge dafür, dass der Kern der Botschaft in allen Formaten erhalten bleibt, aber für den jeweiligen Kanal optimiert ist.

**Kernidee:**
"Die Anwendung von Chain-of-Thought-Prompting kann die Genauigkeit von KI-Antworten bei logischen Problemen um über 40% steigern."

**Zu erstellende Assets:**

1.  **LinkedIn Post:** Ein kurzer, prägnanter Post (ca. 300 Wörter) mit einem starken Hook, der das Problem und die Lösung beschreibt.
2.  **Twitter Thread:** Ein Thread mit 5 Tweets, der das Konzept Schritt für Schritt erklärt.
3.  **Video-Skript (30s):** Ein kurzes Skript für ein TikTok/Reel, das den Unterschied mit einem einfachen Beispiel zeigt.
4.  **Blog-Titel:** Fünf verschiedene, klickstarke Überschriften für einen ausführlichen Blog-Artikel zu diesem Thema.

**Output-Format:**
Strukturiere deine Antwort klar mit Überschriften für jedes Asset.
```

### E-Mail-Personalisierungs-Prompt

Nutzen Sie diesen Prompt, um Standard-E-Mails automatisch mit persönlichen Informationen anzureichern.

```markdown
**Rolle:**
Du bist ein Experte für personalisiertes E-Mail-Marketing. Deine Stärke ist es, generische E-Mails so umzuschreiben, dass sie eine persönliche Verbindung zum Empfänger herstellen.

**Kontext:**
Ich möchte die folgende Standard-Willkommens-E-Mail für einen neuen Newsletter-Abonnenten personalisieren. Nutze die bereitgestellten Informationen, um die Einleitung und den Call-to-Action besonders relevant zu machen.

**Informationen über den Empfänger:**

- **Name:** [Name des Empfängers]
- **Firma:** [Firmenname]
- **Branche:** [Branche]
- **Interessen:** [Bekannte Interessen, z.B. aus dem Anmeldeformular]

**Standard-E-Mail:**
"Hallo,

willkommen bei unserem Newsletter! Wir freuen uns, dass du dabei bist. Hier findest du regelmäßig Tipps und Tricks rund um unser Thema.

Viele Grüße,
Dein Team"

**Aufgabe:**
Schreibe die Standard-E-Mail so um, dass sie einen persönlichen Bezug zur Branche oder den Interessen des Empfängers herstellt. Die neue E-Mail soll authentisch und nicht aufdringlich klingen.
```

---

## Modul 6: Skalierung & Ethik

### Compliance-Checkliste (DSGVO & Ethik)

Verwenden Sie diese Checkliste, bevor Sie eine KI-Automatisierung live schalten, um rechtliche und ethische Risiken zu minimieren.

**Datenschutz (DSGVO/GDPR):**

- [ ] **Einwilligung:** Habe ich eine gültige Einwilligung der betroffenen Person für die Verarbeitung ihrer Daten zu diesem Zweck?
- [ ] **Datensparsamkeit:** Verarbeite ich nur die Daten, die für den Zweck absolut notwendig sind?
- [ ] **Sicherheit:** Werden die Daten sicher gespeichert und übertragen?
- [ ] **Transparenz:** Ist für den Nutzer klar ersichtlich, welche seiner Daten wie und wofür von einer KI verarbeitet werden?
- [ ] **Rechte der Betroffenen:** Kann ich Anfragen auf Auskunft, Berichtigung oder Löschung der Daten einfach nachkommen?

**Bias & Fairness:**

- [ ] **Stereotype:** Habe ich den generierten Output auf verallgemeinernde oder stereotypische Aussagen überprüft?
- [ ] **Diskriminierung:** Könnte der Output eine bestimmte Personengruppe systematisch benachteiligen?
- [ ] **Perspektivenvielfalt:** Habe ich bei der Entwicklung des Systems verschiedene Perspektiven (z.B. unterschiedlicher Kulturen, Geschlechter, Altersgruppen) berücksichtigt?

**Verantwortung & Kontrolle:**

- [ ] **Human in the Loop:** Gibt es an kritischen Stellen im Prozess einen definierten Punkt für eine menschliche Überprüfung und Freigabe?
- [ ] **Verantwortlichkeit:** Ist klar definiert, wer die letztendliche Verantwortung für den Output des KI-Systems trägt?
- [ ] **Nachvollziehbarkeit:** Kann ich im Nachhinein erklären, warum die KI eine bestimmte Entscheidung getroffen oder einen bestimmten Output generiert hat?
- [ ] **Not-Aus:** Gibt es eine Möglichkeit, das System im Fehlerfall schnell und sicher zu stoppen?
