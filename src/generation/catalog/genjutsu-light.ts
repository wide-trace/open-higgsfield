import type { ModelEntry } from "./types";

export const genjutsuLight: ModelEntry = {
  id: "genjutsu-light",
  surface: "video",
  label: "Genjutsu Light",
  roles: { video: 1, reference: 8 },
  minRoles: { video: 1, reference: 1 },
  prompt: {
    required: false,
    maxLength: 10_000,
    placeholder: "Optional direction for the motion transfer…",
  },
  roleHints: {
    video: "The first 15 seconds are used and source audio is preserved.",
  },
  settings: {
    resolution: {
      type: "enum",
      values: ["480p", "720p", "1080p"],
      default: "720p",
      hints: { "480p": "$0.05/s", "720p": "$0.10/s", "1080p": "$0.20/s" },
    },
  },
};
