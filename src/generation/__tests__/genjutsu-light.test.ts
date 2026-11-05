import { describe, expect, it } from "vitest";

import { getModel } from "../catalog";
import type { GenerationPlane, MediaItem } from "../catalog/types";
import { normalizeGenerationStatus } from "../platform";
import { toPlatform } from "../to-platform";
import { validateGeneration } from "../validation";

const video: MediaItem = { id: "video-1", role: "video", url: "https://files.example/source.mp4" };
const image = (id: number): MediaItem => ({
  id: `image-${id}`,
  role: "reference",
  url: `https://files.example/reference-${id}.jpg`,
});

function plane(overrides: Partial<GenerationPlane> = {}): GenerationPlane {
  return {
    model: "genjutsu-light",
    prompt: { text: "Keep the dance energetic" },
    media: { video: [video], reference: [image(1)] },
    settings: { resolution: "720p" },
    ...overrides,
  };
}

describe("Genjutsu Light", () => {
  const model = getModel("genjutsu-light");

  it("declares the documented input limits and 720p default", () => {
    expect(model.roles).toEqual({ video: 1, reference: 8 });
    expect(model.minRoles).toEqual({ video: 1, reference: 1 });
    expect(model.settings.resolution).toMatchObject({
      values: ["480p", "720p", "1080p"],
      default: "720p",
    });
  });

  it("maps the documented request body and preserves an optional empty prompt", () => {
    const mapped = toPlatform(plane({ prompt: { text: "" } }));
    expect(mapped).toEqual({
      path: "higgsfield/genjutsu-light/motion-transfer/v1.0",
      body: {
        prompt: "",
        video_url: video.url,
        image_urls: [image(1).url],
        resolution: "720p",
      },
    });
  });

  it("requires one source video and one to eight reference images", () => {
    expect(() => validateGeneration(model, plane({ media: { reference: [image(1)] } }))).toThrow("source video");
    expect(() => validateGeneration(model, plane({ media: { video: [video] } }))).toThrow("reference image");
    expect(() => toPlatform(plane({ media: { video: [video], reference: Array.from({ length: 9 }, (_, i) => image(i)) } }))).toThrow("between 1 and 8");
  });

  it("enforces the documented prompt maximum", () => {
    expect(() => validateGeneration(model, plane({ prompt: { text: "x".repeat(10_001) } }))).toThrow("10,000");
  });

  it("keeps the video and every optional Genjutsu artifact from a completed response", () => {
    expect(
      normalizeGenerationStatus({
        status: "completed",
        request_id: "request-1",
        video: { url: "https://files.example/result.mp4" },
        zip: { url: "https://files.example/result.zip" },
        mov: { url: "https://files.example/result.mov" },
        jsx: { url: "https://files.example/result.jsx" },
        fbx: { url: "https://files.example/result.fbx" },
        ply: { url: "https://files.example/result.ply" },
      }),
    ).toEqual({
      status: "completed",
      requestId: "request-1",
      video: { url: "https://files.example/result.mp4" },
      artifacts: {
        zip: { url: "https://files.example/result.zip" },
        mov: { url: "https://files.example/result.mov" },
        jsx: { url: "https://files.example/result.jsx" },
        fbx: { url: "https://files.example/result.fbx" },
        ply: { url: "https://files.example/result.ply" },
      },
    });
  });
});
