import { t2v, videoModel } from "./defaults";

export const wan3Prime = videoModel(
  "wan-3-prime",
  "Wan 3.0 Prime",
  { start: 1 },
  t2v("alibaba/wan-3.0-prime/text-to-video"),
);
