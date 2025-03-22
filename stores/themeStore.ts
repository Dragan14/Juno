import { create } from "zustand";
import { useColorScheme } from "react-native";
import { purpleLight, purpleDark } from "../themes/purple-theme";

export const useThemeStore = create(() => {
  const colorScheme = useColorScheme();
  return {
    colorScheme,
    theme: colorScheme === "dark" ? purpleDark : purpleLight,
  };
});
