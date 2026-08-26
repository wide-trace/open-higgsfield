import type { MediaRole, ModelEntry, PlatformPaths } from "./types";

const IMAGE_ASPECT = ["auto", "1:1", "4:3", "3:4", "16:9", "9:16"] as const;
const VIDEO_ASPECT = ["16:9", "9:16", "1:1"] as const;

export function t2v(path: string): PlatformPaths {
  if (!path.endsWith("/text-to-video")) return { text: path };
  return { text: path, image: path.replace(/\/text-to-video$/, "/image-to-video") };
}

export function imageModel(id: string, label: string, paths: PlatformPaths): ModelEntry {
  return {
    id,
    surface: "image",
    label,
    roles: { reference: 8 },
    settings: {
      aspectRatio: { type: "enum", values: IMAGE_ASPECT, default: "1:1" },
      resolution: { type: "enum", values: ["1k", "2k", "4k"], default: "1k" },
    },
    paths,
  };
}

export function videoModel(
  id: string,
  label: string,
  roles: Partial<Record<MediaRole, number>>,
  paths: PlatformPaths,
): ModelEntry {
  return {
    id,
    surface: "video",
    label,
    roles,
    settings: {
      aspectRatio: { type: "enum", values: VIDEO_ASPECT, default: "16:9" },
      resolution: { type: "enum", values: ["720p", "1080p"], default: "720p" },
      duration: { type: "range", min: 4, max: 10, default: 5 },
    },
    paths,
  };
}
