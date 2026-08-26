import type { ModelEntry } from "./types";

const klingTurboSettings = {
  aspectRatio: { type: "enum", values: ["16:9", "9:16", "1:1"], default: "16:9" },
  resolution: { type: "enum", values: ["720p", "1080p"], default: "720p" },
  duration: { type: "range", min: 3, max: 15, default: 5 },
} as const satisfies ModelEntry["settings"];

const kling3Settings = {
  aspectRatio: { type: "enum", values: ["16:9", "9:16", "1:1"], default: "16:9" },
  duration: { type: "range", min: 3, max: 15, default: 5 },
  sound: { type: "boolean", default: true },
  cfgScale: { type: "range", min: 0, max: 1, default: 0.5, step: 0.01 },
  multiShots: { type: "boolean", default: false },
} as const satisfies ModelEntry["settings"];

const klingMotionSettings = {
  keepOriginalSound: { type: "boolean", default: true },
  characterOrientation: { type: "enum", values: ["video", "image"], default: "video" },
} as const satisfies ModelEntry["settings"];

export const kling3Turbo: ModelEntry = {
  id: "kling-3-turbo",
  surface: "video",
  label: "Kling 3.0 Turbo",
  roles: { start: 1 },
  settings: klingTurboSettings,
};

export const kling3Std: ModelEntry = {
  id: "kling-3-std",
  surface: "video",
  label: "Kling 3.0 Standard",
  roles: { start: 1, end: 1 },
  settings: kling3Settings,
};

export const kling3Pro: ModelEntry = {
  id: "kling-3-pro",
  surface: "video",
  label: "Kling 3.0 Pro",
  roles: { start: 1, end: 1 },
  settings: kling3Settings,
};

export const kling34k: ModelEntry = {
  id: "kling-3-4k",
  surface: "video",
  label: "Kling 3.0 4K",
  roles: { start: 1, end: 1 },
  settings: kling3Settings,
};

export const kling3MotionStd: ModelEntry = {
  id: "kling-3-motion-std",
  surface: "video",
  label: "Kling 3.0 Motion Control",
  roles: { start: 1, video: 1 },
  settings: klingMotionSettings,
};

export const kling3MotionPro: ModelEntry = {
  id: "kling-3-motion-pro",
  surface: "video",
  label: "Kling 3.0 Motion Control Pro",
  roles: { start: 1, video: 1 },
  settings: klingMotionSettings,
};