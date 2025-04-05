import { create } from "zustand";
import { blueLight, blueDark } from "@/themes/blue-theme";
import { Appearance } from "react-native";

type Theme = typeof blueLight;

interface ThemeState {
  colorScheme: "light" | "dark";
  theme: Theme;
  setTheme: (colorScheme: "light" | "dark") => void;
}

const initialColorScheme = Appearance.getColorScheme() || "light";

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: initialColorScheme,
  theme: initialColorScheme === "dark" ? blueDark : blueLight,
  setTheme: (colorScheme: "light" | "dark") =>
    set({
      colorScheme,
      theme: colorScheme === "dark" ? blueDark : blueLight,
    }),
}));
