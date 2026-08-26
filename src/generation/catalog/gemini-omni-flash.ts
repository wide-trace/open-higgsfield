import type { ModelEntry } from "./types";

export const geminiOmniFlash: ModelEntry = {
  id: "gemini-omni-flash",
  surface: "video",
  label: "Gemini Omni Flash",
  roles: { reference: 7 },
  settings: {
    aspectRatio: { type: "enum", values: ["16:9", "9:16"], default: "16:9" },
    resolution: { type: "enum", values: ["720p"], default: "720p" },
    duration: { type: "range", min: 3, max: 10, default: 8 },
  },
};