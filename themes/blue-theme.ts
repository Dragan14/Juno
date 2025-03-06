import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { MD3Theme } from "react-native-paper/lib/typescript/types";

// Define custom light theme colors
const blueLight = {
  colors: {
    primary: "rgb(30, 130, 230)", // Blue
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(204, 235, 255)", // Light blue
    onPrimaryContainer: "rgb(0, 45, 89)", // Dark blue
    secondary: "rgb(51, 140, 191)", // Blue-teal
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(212, 242, 255)", // Light blue-teal
    onSecondaryContainer: "rgb(10, 55, 75)", // Dark blue-teal
    tertiary: "rgb(65, 158, 222)", // Blue
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(210, 240, 255)", // Light blue
    onTertiaryContainer: "rgb(15, 60, 85)", // Dark blue
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(245, 252, 255)", // Cool white
    onBackground: "rgb(20, 28, 30)",
    surface: "rgb(245, 252, 255)", // Cool white
    onSurface: "rgb(20, 28, 30)",
    surfaceVariant: "rgb(215, 235, 245)", // Light blue-gray
    onSurfaceVariant: "rgb(60, 75, 80)",
    outline: "rgb(90, 120, 130)",
    outlineVariant: "rgb(180, 205, 215)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(41, 49, 51)",
    inverseOnSurface: "rgb(235, 242, 245)",
    inversePrimary: "rgb(120, 200, 255)", // Light blue
    elevation: {
      level0: "transparent",
      level1: "rgb(240, 248, 252)",
      level2: "rgb(235, 245, 250)",
      level3: "rgb(230, 242, 248)",
      level4: "rgb(228, 240, 247)",
      level5: "rgb(225, 238, 245)",
    },
    surfaceDisabled: "rgba(20, 28, 30, 0.12)",
    onSurfaceDisabled: "rgba(20, 28, 30, 0.38)",
    backdrop: "rgba(40, 50, 55, 0.4)",
  },
};

// Define custom dark theme colors
const blueDark = {
  colors: {
    primary: "rgb(120, 200, 255)", // Light blue
    onPrimary: "rgb(0, 65, 122)", // Dark blue
    primaryContainer: "rgb(10, 95, 170)", // Medium blue
    onPrimaryContainer: "rgb(204, 235, 255)", // Light blue
    secondary: "rgb(130, 205, 235)", // Light blue-teal
    onSecondary: "rgb(10, 55, 70)", // Dark blue-teal
    secondaryContainer: "rgb(35, 85, 105)", // Medium blue-teal
    onSecondaryContainer: "rgb(212, 242, 255)", // Light blue-teal
    tertiary: "rgb(155, 215, 245)", // Light blue
    onTertiary: "rgb(15, 55, 75)", // Dark blue
    tertiaryContainer: "rgb(35, 80, 105)", // Medium blue
    onTertiaryContainer: "rgb(210, 240, 255)", // Light blue
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(20, 28, 30)", // Dark blue-gray
    onBackground: "rgb(215, 230, 235)", // Light blue-gray
    surface: "rgb(20, 28, 30)", // Dark blue-gray
    onSurface: "rgb(215, 230, 235)", // Light blue-gray
    surfaceVariant: "rgb(60, 75, 80)", // Medium blue-gray
    onSurfaceVariant: "rgb(180, 205, 215)", // Blue-gray
    outline: "rgb(120, 150, 160)", // Medium blue-gray
    outlineVariant: "rgb(60, 75, 80)", // Medium blue-gray
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(215, 230, 235)", // Light blue-gray
    inverseOnSurface: "rgb(41, 49, 51)", // Dark blue-gray
    inversePrimary: "rgb(30, 130, 230)", // Blue
    elevation: {
      level0: "transparent",
      level1: "rgb(27, 37, 41)",
      level2: "rgb(30, 43, 48)",
      level3: "rgb(33, 48, 55)",
      level4: "rgb(34, 50, 57)",
      level5: "rgb(36, 54, 62)",
    },
    surfaceDisabled: "rgba(215, 230, 235, 0.12)",
    onSurfaceDisabled: "rgba(215, 230, 235, 0.38)",
    backdrop: "rgba(40, 50, 55, 0.4)",
  },
};

// Create a theme object
export const blueLightTheme: MD3Theme = {
  ...MD3LightTheme,
  ...blueLight,
};

export const blueDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  ...blueDark,
};
