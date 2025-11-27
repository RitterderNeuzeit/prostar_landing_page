// Central AI model configuration
// Reads environment variables to decide which AI model is active across clients.
// Default falls back to Claude Sonnet 4.5 if not overridden.

export const ACTIVE_AI_MODEL = process.env.AI_MODEL || "claude-sonnet-4.5";
export const AI_MODEL_PROVIDER = process.env.AI_MODEL_PROVIDER || "anthropic";

// Helper to check if a given model is active
export function isModel(model: string): boolean {
  return ACTIVE_AI_MODEL.toLowerCase() === model.toLowerCase();
}

// Potential future extension: capability map
export const MODEL_CAPABILITIES: Record<string, string[]> = {
  "claude-sonnet-4.5": ["chat", "reasoning", "summarize"],
};
