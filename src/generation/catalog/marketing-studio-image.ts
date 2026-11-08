import type { ModelEntry } from "./types";

/* Marketing Studio Image is Higgsfield's ad-creative model: a prompt alone for
   text-to-image, or product (and person) photos as references to edit. The
   platform's preset mode (enhance_prompt with a preset_id) needs a live preset
   list, so the studio sends plain prompts and references only. Flare and
   Sunburst share one schema, including the xhigh and max quality tiers that
   the 2.0 Alpha endpoint lacks. */
const marketingSettings = {
  aspectRatio: {
    type: "enum",
    values: ["1:1", "4:3", "3:4", "3:2", "2:3", "16:9", "9:16", "21:9"],
    default: "1:1",
  },
  resolution: { type: "enum", values: ["1k", "2k", "4k"], default: "2k" },
  quality: { type: "enum", values: ["low", "medium", "high", "xhigh", "max"], default: "high" },
} as const satisfies ModelEntry["settings"];

export const marketingStudioFlare: ModelEntry = {
  id: "marketing-studio-flare",
  surface: "image",
  label: "Marketing Studio Flare",
  roles: { reference: 16 },
  settings: marketingSettings,
};

export const marketingStudioSunburst: ModelEntry = {
  id: "marketing-studio-sunburst",
  surface: "image",
  label: "Marketing Studio Sunburst",
  roles: { reference: 16 },
  settings: marketingSettings,
};
