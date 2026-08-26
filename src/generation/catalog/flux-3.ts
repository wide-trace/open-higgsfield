import { t2v, videoModel } from "./defaults";

export const flux3 = videoModel(
  "flux-3",
  "Flux 3",
  { start: 1 },
  t2v("blackforestlabs/flux-3/text-to-video"),
);
