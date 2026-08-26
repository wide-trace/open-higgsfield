import type { ModelEntry } from "./types";
import { BANANA_ASPECT } from "./tokens";

export const nanoBananaPro: ModelEntry = {
  id: "nano-banana-pro",
  surface: "image",
  label: "Nano Banana Pro",
  roles: { reference: 14 },
  settings: {
    aspectRatio: { type: "enum", values: BANANA_ASPECT, default: "4:3" },
    resolution: { type: "enum", values: ["1k", "2k", "4k"], default: "1k" },
    outputFormat: { type: "enum", values: ["png", "jpeg"], default: "png" },
    numImages: { type: "range", min: 1, max: 4, default: 1 },
  },
};