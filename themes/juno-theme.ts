import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { MD3Theme } from "react-native-paper/lib/typescript/types";

// Define custom light theme colors
const junoLight = {
  colors: {
    primary: "rgb(230, 130, 20)", // Orange
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 235, 204)", // Light orange
    onPrimaryContainer: "rgb(89, 45, 0)", // Dark brown
    secondary: "rgb(191, 140, 51)", // Gold
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 242, 212)", // Light gold
    onSecondaryContainer: "rgb(75, 55, 10)", // Dark gold
    tertiary: "rgb(222, 158, 65)", // Amber
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 240, 210)", // Light amber
    onTertiaryContainer: "rgb(85, 60, 15)", // Dark amber
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 252, 245)", // Cream
    onBackground: "rgb(30, 28, 20)",
    surface: "rgb(255, 252, 245)", // Cream
    onSurface: "rgb(30, 28, 20)",
    surfaceVariant: "rgb(245, 235, 215)", // Beige
    onSurfaceVariant: "rgb(80, 75, 60)",
    outline: "rgb(130, 120, 90)",
    outlineVariant: "rgb(215, 205, 180)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(51, 49, 41)",
    inverseOnSurface: "rgb(245, 242, 235)",
    inversePrimary: "rgb(255, 200, 120)", // Light orange
    elevation: {
      level0: "transparent",
      level1: "rgb(252, 248, 240)",
      level2: "rgb(250, 245, 235)",
      level3: "rgb(248, 242, 230)",
      level4: "rgb(247, 240, 228)",
      level5: "rgb(245, 238, 225)",
    },
    surfaceDisabled: "rgba(30, 28, 20, 0.12)",
    onSurfaceDisabled: "rgba(30, 28, 20, 0.38)",
    backdrop: "rgba(55, 50, 40, 0.4)",
  },
};

// Define custom dark theme colors
const junoDark = {
  colors: {
    primary: "rgb(255, 200, 120)", // Light orange
    onPrimary: "rgb(122, 65, 0)", // Dark orange
    primaryContainer: "rgb(170, 95, 10)", // Medium orange
    onPrimaryContainer: "rgb(255, 235, 204)", // Light orange
    secondary: "rgb(235, 205, 130)", // Light gold
    onSecondary: "rgb(70, 55, 10)", // Dark gold
    secondaryContainer: "rgb(105, 85, 35)", // Medium gold
    onSecondaryContainer: "rgb(255, 242, 212)", // Light gold
    tertiary: "rgb(245, 215, 155)", // Light amber
    onTertiary: "rgb(75, 55, 15)", // Dark amber
    tertiaryContainer: "rgb(105, 80, 35)", // Medium amber
    onTertiaryContainer: "rgb(255, 240, 210)", // Light amber
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(30, 28, 20)", // Dark brown
    onBackground: "rgb(235, 230, 215)", // Light beige
    surface: "rgb(30, 28, 20)", // Dark brown
    onSurface: "rgb(235, 230, 215)", // Light beige
    surfaceVariant: "rgb(80, 75, 60)", // Medium brown
    onSurfaceVariant: "rgb(215, 205, 180)", // Beige
    outline: "rgb(160, 150, 120)", // Medium beige
    outlineVariant: "rgb(80, 75, 60)", // Medium brown
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(235, 230, 215)", // Light beige
    inverseOnSurface: "rgb(51, 49, 41)", // Dark brown
    inversePrimary: "rgb(230, 130, 20)", // Orange
    elevation: {
      level0: "transparent",
      level1: "rgb(41, 37, 27)",
      level2: "rgb(48, 43, 30)",
      level3: "rgb(55, 48, 33)",
      level4: "rgb(57, 50, 34)",
      level5: "rgb(62, 54, 36)",
    },
    surfaceDisabled: "rgba(235, 230, 215, 0.12)",
    onSurfaceDisabled: "rgba(235, 230, 215, 0.38)",
    backdrop: "rgba(55, 50, 40, 0.4)",
  },
};

// Create a theme object
export const junoLightTheme: MD3Theme = {
  ...MD3LightTheme,
  ...junoLight,
};

export const junoDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  ...junoDark,
};
