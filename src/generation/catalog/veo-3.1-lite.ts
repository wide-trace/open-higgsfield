import { t2v, videoModel } from "./defaults";

export const veo31Lite = videoModel("veo-3.1-lite", "Veo 3.1 Lite", { start: 1, end: 1, reference: 8 }, {
  ...t2v("veo3.1/lite/text-to-video"),
  firstLast: "veo3.1/lite/first-last-frame-to-video",
  reference: "veo3.1/lite/reference-to-video",
});
