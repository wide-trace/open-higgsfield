import { t2v, videoModel } from "./defaults";

export const veo31Fast = videoModel("veo-3.1-fast", "Veo 3.1 Fast", { start: 1, end: 1, reference: 8 }, {
  ...t2v("veo3.1/fast/text-to-video"),
  firstLast: "veo3.1/fast/first-last-frame-to-video",
  reference: "veo3.1/fast/reference-to-video",
});
