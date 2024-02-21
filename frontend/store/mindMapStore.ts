import { create } from "zustand";

export type Orientation = "Top" | "Bottom" | "Right" | "Left";
type MindMapState = {
  orientation: Orientation;
  setOrientation: (orientation: Orientation) => void;
};

export const useAuth = create<MindMapState>((set, get) => ({
  orientation: "Right",
  setOrientation: (orientation) => set({ orientation }),
}));

export function useMindMapStore() {
  return useAuth((state) => state);
}
