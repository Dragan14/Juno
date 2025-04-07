import { create } from "zustand";
import { blueLight, blueDark } from "@/themes/blue-theme";
import { purpleLight, purpleDark } from "@/themes/purple-theme";
import { Appearance } from "react-native";

type Theme = typeof purpleLight;

interface ThemeState {
  colorScheme: "light" | "dark";
  theme: Theme;
  setTheme: (colorScheme: "light" | "dark") => void;
}

const initialColorScheme = Appearance.getColorScheme() || "light";

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: initialColorScheme,
  theme: initialColorScheme === "dark" ? purpleDark : purpleLight,
  setTheme: (colorScheme: "light" | "dark") =>
    set({
      colorScheme,
      theme: colorScheme === "dark" ? purpleDark : purpleLight,
    }),
}));
