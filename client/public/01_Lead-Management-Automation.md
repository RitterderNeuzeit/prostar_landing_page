# 5.1 Lead Management Automation

## Das Problem

Du hast:

- 1000 Leads
- 1 Person (dich)
- 8 Stunden pro Woche für Qualifizierung

**Realität:** Du packst max 100 Leads.

**Lösung:** Lead Management Agent

---

## Das System (3 Prompts)

### Prompt 1: Lead Research

```
Du bist ein B2B Lead Researcher.

Finde 50 neue Leads auf LinkedIn die:
- CTO/VP Engineering sind
- Bei Agenturen mit 20-100 Mitarbeitern
- Im deutschsprachigen Raum
- Active hiring (erkennbar an LinkedIn activity)

Für jeden Lead gib:
- Name, Title, Company
- Company Size, Website
- 2-3 Recent Activities/News hooks

Format: CSV
```

### Prompt 2: Lead Qualification (BANT)

```
Du bist ein Sales Qualification Expert.

Qualifiziere diese Leads nach BANT:
B (Budget): Hat die Company Geld? (Min 2m Euro ARR?)
A (Authority): Ist das der Decision Maker?
N (Need): Brauchen sie unser Produkt? (Agenturen mit ineffizienten Prozessen)
T (Timeline): Sind sie urgent buying (neue hire = dringender need)

Returns: Nur TOP 20 Leads, die 3+ von 4 Kriterien erfüllen
Für jeden: Score + Grund

Format: Tabelle mit Priorität 1-20
```

### Prompt 3: Personalized Outreach

```
Du bist ein LinkedIn Outreach Specialist mit 50% Connection Accept Rate.

Für diese TOP 20 Leads:
Schreib personalisierte LinkedIn Connection Messages

Jede Message muss:
- Specific company mention (recent news, new hire, etc.)
- Problem-focused (not salesy)
- Clear CTA (free consultation or audit)
- Max 2-3 Zeilen

3 Varianten mit unterschiedlichen Angles:
1. Problem angle
2. Opportunity angle
3. Social proof angle

Format: List of 20 messages
```

---

## Ergebnisse

| Metrik             | Manual    | Automated          | Gain  |
| ------------------ | --------- | ------------------ | ----- |
| Leads researched   | 100/Woche | 50/Tag = 250/Woche | +150% |
| Qualification time | 5h        | 30min              | -94%  |
| Accept rate        | 15%       | 40%                | +165% |
| Qualified meetings | 2-3/Woche | 15-20/Woche        | +700% |

---

## Deine Aktion

1. Download den Lead Research Prompt
2. Customize für deine Industrie
3. Run the 3-Prompt System
4. Track: Wie viele Meetings booked?
5. Iterate: Was funktioniert?

✅ Du hast jetzt eine Lead-Maschine
