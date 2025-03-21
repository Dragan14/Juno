import { create } from "zustand";

interface ErrorState {
  message: string;
  visible: boolean;
  showError: (message: string) => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  message: "",
  visible: false,
  showError: (message: string) => set({ message, visible: true }),
  hideError: () => set({ visible: false }),
}));
