import { t2v, videoModel } from "./defaults";

export const happyHorse11 = videoModel(
  "happy-horse-1.1",
  "Happy Horse 1.1",
  { start: 1 },
  t2v("alibaba/happy-horse/v1.1/text-to-video"),
);
