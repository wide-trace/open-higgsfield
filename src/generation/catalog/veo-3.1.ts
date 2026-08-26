import { t2v, videoModel } from "./defaults";

export const veo31 = videoModel("veo-3.1", "Veo 3.1", { start: 1, end: 1, reference: 8 }, {
  ...t2v("veo3.1/text-to-video"),
  firstLast: "veo3.1/first-last-frame-to-video",
  reference: "veo3.1/reference-to-video",
});
