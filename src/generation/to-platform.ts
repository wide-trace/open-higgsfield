import { getModel } from "./catalog";
import type { GenerationPlane, PlatformPaths } from "./catalog/types";

type Mapped = { path: string; body: Record<string, unknown> };
type Mapper = (plane: GenerationPlane) => Mapped;

const MAP: Record<string, Mapper> = {
  "soul-cinema": (plane) => mapSoul(plane, "higgsfield-ai/soul/cinema"),
  "soul-2": (plane) => mapSoul(plane, "higgsfield-ai/soul/v2/standard"),
  "kling-3-turbo": mapKlingTurbo,
  "kling-3-std": (plane) => mapKling3(plane, "kling-video/v3.0/std"),
  "kling-3-pro": (plane) => mapKling3(plane, "kling-video/v3.0/pro"),
  "kling-3-4k": (plane) => mapKling3(plane, "kling-video/v3.0/4k"),
  "kling-3-motion-std": (plane) => mapKlingMotion(plane, "kling-video/v3/motion-control/std"),
  "kling-3-motion-pro": (plane) => mapKlingMotion(plane, "kling-video/v3/motion-control/pro"),
  "seedance-2": (plane) => mapSeedance(plane, "bytedance/seedance-2.0"),
  "seedance-2-fast": (plane) => mapSeedance(plane, "bytedance/seedance-2.0/fast"),
  "seedance-2-mini": (plane) => mapSeedance(plane, "bytedance/seedance-2.0/mini"),
  "seedance-2.5": (plane) => mapSeedance(plane, "bytedance/seedance-2.5"),
  "seedance-2.5-edit": (plane) => mapSeedanceSource(plane, "bytedance/seedance-2.5/video-edit", false),
  "seedance-2.5-extend": (plane) => mapSeedanceSource(plane, "bytedance/seedance-2.5/video-extend", true),
  "genjutsu-light-motion-transfer": mapGenjutsuLightMotionTransfer,
};

export function toPlatform(plane: GenerationPlane): Mapped {
  const model = getModel(plane.model);
  const map = MAP[model.id] ?? (model.paths ? (next) => mapByPaths(next, model.paths!) : undefined);
  if (!map) throw new Error(`No platform map for ${plane.model}`);
  return map(plane);
}

function mapGenjutsuLightMotionTransfer(plane: GenerationPlane): Mapped {
  const video = urls(plane, "video");
  const images = urls(plane, "reference");
  if (video.length !== 1) throw new Error("Genjutsu Light requires one source video");
  if (images.length < 1 || images.length > 8) {
    throw new Error("Genjutsu Light requires between 1 and 8 reference images");
  }
  return {
    path: "higgsfield/genjutsu-light/motion-transfer/v1.0",
    body: {
      prompt: plane.prompt.text.trim(),
      video_url: video[0],
      image_urls: images,
      resolution: plane.settings.resolution,
    },
  };
}

function urls(plane: GenerationPlane, role: "start" | "end" | "reference" | "video" | "audio") {
  return (plane.media[role] ?? []).map((item) => item.url);
}

function mapSoul(plane: GenerationPlane, path: string): Mapped {
  return {
    path,
    body: {
      prompt: plane.prompt.text,
      batch_size: Number(plane.settings.batchSize),
      resolution: plane.settings.resolution,
      aspect_ratio: plane.settings.aspectRatio,
      enhance_prompt: plane.settings.enhancePrompt,
    },
  };
}

function mapKlingTurbo(plane: GenerationPlane): Mapped {
  const start = urls(plane, "start")[0];
  return {
    path: start
      ? "kling-video/v3.0-turbo/image-to-video"
      : "kling-video/v3.0-turbo/text-to-video",
    body: {
      prompt: plane.prompt.text,
      duration: plane.settings.duration,
      resolution: plane.settings.resolution,
      ...(start ? { image_url: start } : { aspect_ratio: plane.settings.aspectRatio }),
    },
  };
}

function mapKling3(plane: GenerationPlane, prefix: string): Mapped {
  const start = urls(plane, "start")[0];
  const end = urls(plane, "end")[0];
  const body: Record<string, unknown> = {
    prompt: plane.prompt.text,
    sound: plane.settings.sound ? "on" : "off",
    duration: plane.settings.duration,
    cfg_scale: plane.settings.cfgScale,
    multi_shots: plane.settings.multiShots,
  };
  if (start) {
    body.image_url = start;
    if (end) body.last_image_url = end;
    return { path: `${prefix}/image-to-video`, body };
  }
  body.aspect_ratio = plane.settings.aspectRatio;
  return { path: `${prefix}/text-to-video`, body };
}

function mapKlingMotion(plane: GenerationPlane, path: string): Mapped {
  const start = urls(plane, "start")[0];
  const video = urls(plane, "video")[0];
  return {
    path,
    body: {
      prompt: plane.prompt.text,
      ...(start ? { image_url: start } : {}),
      ...(video ? { video_url: video } : {}),
      keep_original_sound: plane.settings.keepOriginalSound ? "yes" : "no",
      character_orientation: plane.settings.characterOrientation,
    },
  };
}

function mapByPaths(plane: GenerationPlane, spec: PlatformPaths): Mapped {
  const start = urls(plane, "start")[0];
  const end = urls(plane, "end")[0];
  const refs = urls(plane, "reference");
  const videos = urls(plane, "video");
  const body: Record<string, unknown> = {
    prompt: plane.prompt.text,
    ...(plane.settings.aspectRatio ? { aspect_ratio: plane.settings.aspectRatio } : {}),
    ...(plane.settings.resolution ? { resolution: plane.settings.resolution } : {}),
    ...(typeof plane.settings.duration === "number" ? { duration: plane.settings.duration } : {}),
  };
  if (spec.firstLast && (start || end)) {
    return {
      path: spec.firstLast,
      body: {
        ...body,
        ...(start ? { first_frame_url: start } : {}),
        ...(end ? { last_frame_url: end } : {}),
      },
    };
  }
  if (spec.image && start) {
    return {
      path: spec.image,
      body: { ...body, image_url: start, ...(end ? { last_image_url: end } : {}) },
    };
  }
  if (spec.reference && (refs.length || videos.length)) {
    return {
      path: spec.reference,
      body: {
        ...body,
        ...(refs.length ? { image_urls: refs } : {}),
        ...(videos.length ? { video_urls: videos } : {}),
      },
    };
  }
  if (spec.text) {
    return {
      path: spec.text,
      body: refs.length ? { ...body, image_urls: refs } : body,
    };
  }
  if (spec.image) return { path: spec.image, body };
  if (spec.reference) return { path: spec.reference, body };
  if (spec.firstLast) return { path: spec.firstLast, body };
  throw new Error("Model has no platform path");
}

function seedanceBody(plane: GenerationPlane, withDuration: boolean) {
  return {
    prompt: plane.prompt.text,
    resolution: plane.settings.resolution,
    generate_audio: plane.settings.generateAudio,
    ...(withDuration ? { duration: plane.settings.duration } : {}),
    ...(plane.settings.outputFormat ? { output_format: plane.settings.outputFormat } : {}),
  };
}

function mapSeedance(plane: GenerationPlane, prefix: string): Mapped {
  const start = urls(plane, "start")[0];
  const end = urls(plane, "end")[0];
  const refs = urls(plane, "reference");
  const videos = urls(plane, "video");
  const audios = urls(plane, "audio");
  const shared = seedanceBody(plane, true);
  if (start) {
    return {
      path: `${prefix}/image-to-video`,
      body: { ...shared, image_url: start, ...(end ? { end_image_url: end } : {}) },
    };
  }
  if (refs.length || videos.length || audios.length) {
    return {
      path: `${prefix}/reference-to-video`,
      body: {
        ...shared,
        aspect_ratio: plane.settings.aspectRatio,
        ...(refs.length ? { image_urls: refs } : {}),
        ...(videos.length ? { video_urls: videos } : {}),
        ...(audios.length ? { audio_urls: audios } : {}),
      },
    };
  }
  return {
    path: `${prefix}/text-to-video`,
    body: { ...shared, aspect_ratio: plane.settings.aspectRatio },
  };
}

function mapSeedanceSource(plane: GenerationPlane, path: string, withDuration: boolean): Mapped {
  const [video, ...extraVideos] = urls(plane, "video");
  const refs = urls(plane, "reference");
  const audios = urls(plane, "audio");
  return {
    path,
    body: {
      ...seedanceBody(plane, withDuration),
      ...(video ? { video_url: video } : {}),
      ...(refs.length ? { image_urls: refs } : {}),
      ...(extraVideos.length ? { video_urls: extraVideos } : {}),
      ...(audios.length ? { audio_urls: audios } : {}),
    },
  };
}
