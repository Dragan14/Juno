import { create } from "zustand";
import { purpleLight, purpleDark } from "../themes/purple-theme";

// Define the theme type - adjust according to your actual theme type
type Theme = typeof purpleLight;

// Define the store state type
interface ThemeState {
  colorScheme: "light" | "dark";
  theme: Theme;
  setTheme: (colorScheme: "light" | "dark") => void;
}

// Create the typed store
export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: "light", // Default value
  theme: purpleLight, // Default theme
  setTheme: (colorScheme: "light" | "dark") =>
    set({
      colorScheme,
      theme: colorScheme === "dark" ? purpleDark : purpleLight,
    }),
}));
