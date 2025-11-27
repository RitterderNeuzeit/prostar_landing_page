export interface CourseModule {
  id: number;
  title: string;
  description: string;
  contentFile: string;
  duration: string;
  tier: "starter" | "professional" | "enterprise";
}

export interface CourseTier {
  id: "starter" | "professional" | "enterprise";
  name: string;
  price: number;
  modules: number[];
}

export const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "Was ist KI wirklich?",
    description:
      "Verstehen Sie die Grundlagen von KI und warum gutes Prompting entscheidend ist.",
    contentFile: "/01_Was-ist-KI-wirklich.md",
    duration: "15 min",
    tier: "starter",
  },
  {
    id: 2,
    title: "Das Kollegenprinzip",
    description:
      "Lernen Sie, KI wie einen Mitarbeiter zu führen - mit klaren Rollen und Kontext.",
    contentFile: "/02_Das-Kollegenprinzip.md",
    duration: "20 min",
    tier: "starter",
  },
  {
    id: 3,
    title: "KAAB-Formel",
    description:
      "Die bewährte Formel für perfekte KI-Prompts: Kontext, Aufgabe, Anforderungen, Beispiel.",
    contentFile: "/03_KAAB-Formel.md",
    duration: "25 min",
    tier: "starter",
  },
  {
    id: 4,
    title: "Rollen-Prompting",
    description:
      "Meistern Sie die Kunst des Rollen-Prompting für präzisere KI-Ausgaben.",
    contentFile: "/01_Rollen-Prompting.md",
    duration: "18 min",
    tier: "professional",
  },
  {
    id: 5,
    title: "Chain-of-Thought",
    description:
      "Verwenden Sie Chain-of-Thought Prompting für komplexe Problemlösungen.",
    contentFile: "/01_Chain-of-Thought.md",
    duration: "22 min",
    tier: "professional",
  },
  {
    id: 6,
    title: "Vom Chatbot zum Agenten",
    description:
      "Transformieren Sie KI-Chatbots in intelligente Agenten für Automation.",
    contentFile: "/01_Vom-Chatbot-zum-Agenten.md",
    duration: "30 min",
    tier: "professional",
  },
  {
    id: 7,
    title: "Lead-Management-Automation",
    description: "Automatisieren Sie Ihr Lead-Management mit KI-Agenten.",
    contentFile: "/01_Lead-Management-Automation.md",
    duration: "25 min",
    tier: "enterprise",
  },
  {
    id: 8,
    title: "Bonus: Quick-Reference-Guide",
    description:
      "Schnelle Referenzen und Best Practices für tägliche KI-Nutzung.",
    contentFile: "/Bonusabschnitte&Quick-Reference-Guide.md",
    duration: "10 min",
    tier: "professional",
  },
  {
    id: 9,
    title: "Handouts & Templates",
    description:
      "Umfangreiche Vorlagen, Checklisten und Prompt-Vorlagen zum Downloaden.",
    contentFile: "/Handouts_Templates,Checklisten&Prompt-Vorlagen.md",
    duration: "15 min",
    tier: "professional",
  },
];

export const courseTiers: CourseTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 97,
    modules: [1, 2, 3],
  },
  {
    id: "professional",
    name: "Professional",
    price: 197,
    modules: [1, 2, 3, 4, 5, 6, 8, 9],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 497,
    modules: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
];

export function getModulesByTier(
  tier: "starter" | "professional" | "enterprise"
): CourseModule[] {
  const tierData = courseTiers.find(t => t.id === tier);
  if (!tierData) return [];
  return courseModules.filter(m => tierData.modules.includes(m.id));
}

export function getModuleById(id: number): CourseModule | undefined {
  return courseModules.find(m => m.id === id);
}

export function canAccessModule(
  moduleId: number,
  userTier: "starter" | "professional" | "enterprise" | null
): boolean {
  if (!userTier) return false;
  const module = getModuleById(moduleId);
  if (!module) return false;

  const tierData = courseTiers.find(t => t.id === userTier);
  return tierData?.modules.includes(moduleId) ?? false;
}
