import type { GenerationPlane, ModelEntry } from "./catalog/types";

/** Validates rules declared by a model before its request is sent. This lives
    outside the server action so it can be covered without credentials. */
export function validateGeneration(model: ModelEntry, plane: GenerationPlane): void {
  if (model.prompt?.maxLength && plane.prompt.text.length > model.prompt.maxLength) {
    throw new Error(`Prompt must be ${model.prompt.maxLength.toLocaleString()} characters or fewer`);
  }
  if (model.prompt?.required !== false && !plane.prompt.text.trim()) {
    throw new Error("A prompt is required");
  }
  for (const [role, minimum] of Object.entries(model.minRoles ?? {})) {
    if ((plane.media[role as keyof GenerationPlane["media"]] ?? []).length < minimum) {
      const label = role === "reference" ? "reference image" : "source video";
      throw new Error(`${model.label} requires ${minimum} ${label}`);
    }
  }
}
