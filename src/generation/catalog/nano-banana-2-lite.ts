import type { ModelEntry } from "./types";
import { BANANA_ASPECT } from "./tokens";

export const nanoBanana2Lite: ModelEntry = {
  id: "nano-banana-2-lite",
  surface: "image",
  label: "Nano Banana 2 Lite",
  roles: { reference: 14 },
  settings: {
    aspectRatio: { type: "enum", values: BANANA_ASPECT, default: "4:3" },
    resolution: { type: "enum", values: ["1k"], default: "1k" },
    outputFormat: { type: "enum", values: ["png", "jpeg"], default: "png" },
    thinking: { type: "enum", values: ["MINIMAL", "HIGH"], default: "HIGH" },
  },
};