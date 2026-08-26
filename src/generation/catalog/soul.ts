import type { ModelEntry } from "./types";
import { SOUL_ASPECT } from "./tokens";

const soulSettings = {
  aspectRatio: { type: "enum", values: SOUL_ASPECT, default: "1:1" },
  resolution: { type: "enum", values: ["720p", "1080p"], default: "720p" },
  batchSize: { type: "enum", values: ["1", "4"], default: "1" },
  enhancePrompt: { type: "boolean", default: false },
} as const satisfies ModelEntry["settings"];

export const soulCinema: ModelEntry = {
  id: "soul-cinema",
  surface: "image",
  label: "Soul Cinema",
  roles: {},
  settings: soulSettings,
};

export const soul2: ModelEntry = {
  id: "soul-2",
  surface: "image",
  label: "Soul 2",
  roles: {},
  settings: soulSettings,
};