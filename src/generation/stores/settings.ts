import { create } from "zustand";
import { persist } from "zustand/middleware";

import { browserStorage } from "./browser-storage";

type SettingsState = {
  byModel: Record<string, Record<string, unknown>>;
  set: (modelId: string, patch: Record<string, unknown>) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      byModel: {},
      set: (modelId, patch) =>
        set((state) => {
          const current = state.byModel[modelId];
          if (current && Object.entries(patch).every(([key, value]) => Object.is(current[key], value))) {
            return state;
          }
          return {
            byModel: {
              ...state.byModel,
              [modelId]: { ...current, ...patch },
            },
          };
        }),
    }),
    { name: "openhiggsfield.settings.v1", storage: browserStorage(), partialize: (state) => ({ byModel: state.byModel }) },
  ),
);
