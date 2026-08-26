import { create } from "zustand";
import { persist } from "zustand/middleware";

import { browserStorage } from "./browser-storage";

type PromptState = {
  text: string;
  setText: (text: string) => void;
};

function createPromptStore(name: string) {
  return create<PromptState>()(
    persist(
      (set) => ({
        text: "",
        setText: (text) => set((state) => (state.text === text ? state : { text })),
      }),
      { name, storage: browserStorage(), partialize: (state) => ({ text: state.text }) },
    ),
  );
}

export const useImagePrompt = createPromptStore("openhiggsfield.imagePrompt.v1");
export const useVideoPrompt = createPromptStore("openhiggsfield.videoPrompt.v1");
