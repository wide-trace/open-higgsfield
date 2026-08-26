import { t2v, videoModel } from "./defaults";

export const happyHorse1 = videoModel(
  "happy-horse-1",
  "Happy Horse 1.0",
  { start: 1 },
  t2v("alibaba/happy-horse/text-to-video"),
);
