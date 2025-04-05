// Define custom light theme colors - BLUE
export const blueLight = {
  colors: {
    // Primary roles - Blue focused
    primary: "rgb(0, 100, 210)", // A vibrant blue
    onPrimary: "rgb(255, 255, 255)", // White text on primary
    primaryContainer: "rgb(210, 228, 255)", // Light blue container
    onPrimaryContainer: "rgb(0, 28, 58)", // Dark blue text on light blue container

    // Secondary roles - Often complementary or analogous, using a cooler gray/blue
    secondary: "rgb(84, 96, 110)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(216, 228, 245)",
    onSecondaryContainer: "rgb(19, 30, 42)",

    // Tertiary roles - Accent, can be warmer or a different hue, using a teal/cyan
    tertiary: "rgb(0, 104, 116)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(151, 240, 255)",
    onTertiaryContainer: "rgb(0, 31, 36)",

    // Error roles - Standard red
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",

    // Neutral Background/Surface roles - Near white, slightly cool tint
    background: "rgb(251, 252, 255)", // Slightly off-white, cool tint
    onBackground: "rgb(26, 28, 30)", // Dark gray text
    surface: "rgb(251, 252, 255)", // Same as background
    onSurface: "rgb(26, 28, 30)", // Dark gray text

    // Neutral Variant roles - Grayish tones, slightly cool tint
    surfaceVariant: "rgb(222, 227, 235)", // Light cool gray
    onSurfaceVariant: "rgb(66, 71, 78)", // Medium cool gray text
    outline: "rgb(114, 119, 127)", // Medium cool gray outline
    outlineVariant: "rgb(194, 199, 207)", // Lighter cool gray outline variant

    // Utility roles
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(47, 48, 51)", // Dark surface for inverse
    inverseOnSurface: "rgb(240, 240, 244)", // Light text for inverse
    inversePrimary: "rgb(160, 200, 255)", // Light blue for dark theme primary equivalent

    // Elevation - Subtle overlays on surface, slightly cooler tint progression
    elevation: {
      level0: "transparent",
      level1: "rgb(240, 245, 253)", // Subtle blue-tinted overlay
      level2: "rgb(234, 241, 252)",
      level3: "rgb(227, 237, 251)",
      level4: "rgb(225, 236, 251)",
      level5: "rgb(220, 233, 250)",
    },

    // States
    surfaceDisabled: "rgba(26, 28, 30, 0.12)", // Based on onSurface
    onSurfaceDisabled: "rgba(26, 28, 30, 0.38)", // Based on onSurface
    backdrop: "rgba(45, 49, 56, 0.4)", // Slightly cooler backdrop
  },
};

// Define custom dark theme colors - BLUE
export const blueDark = {
  colors: {
    // Primary roles - Lighter blue for dark mode
    primary: "rgb(160, 200, 255)", // Lighter blue, suitable for dark bg
    onPrimary: "rgb(0, 48, 90)", // Dark blue text on light blue primary
    primaryContainer: "rgb(0, 72, 145)", // Darker blue container
    onPrimaryContainer: "rgb(210, 228, 255)", // Light blue text on dark blue container

    // Secondary roles - Lighter cool gray/blue
    secondary: "rgb(188, 199, 214)",
    onSecondary: "rgb(38, 49, 61)",
    secondaryContainer: "rgb(60, 72, 85)",
    onSecondaryContainer: "rgb(216, 228, 245)",

    // Tertiary roles - Lighter teal/cyan
    tertiary: "rgb(79, 218, 235)",
    onTertiary: "rgb(0, 53, 60)",
    tertiaryContainer: "rgb(0, 78, 87)",
    onTertiaryContainer: "rgb(151, 240, 255)",

    // Error roles - Lighter red for dark mode
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)", // Match error color

    // Neutral Background/Surface roles - Very dark gray, slightly cool tint
    background: "rgb(26, 28, 30)", // Dark cool gray
    onBackground: "rgb(227, 226, 230)", // Light gray text
    surface: "rgb(26, 28, 30)", // Same as background
    onSurface: "rgb(227, 226, 230)", // Light gray text

    // Neutral Variant roles - Darker cool grays
    surfaceVariant: "rgb(66, 71, 78)", // Dark cool gray
    onSurfaceVariant: "rgb(194, 199, 207)", // Lighter cool gray text
    outline: "rgb(140, 145, 153)", // Medium cool gray outline
    outlineVariant: "rgb(66, 71, 78)", // Dark cool gray outline variant

    // Utility roles
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(227, 226, 230)", // Light surface for inverse
    inverseOnSurface: "rgb(47, 48, 51)", // Dark text for inverse
    inversePrimary: "rgb(0, 100, 210)", // Original light theme primary blue

    // Elevation - Subtle lighter overlays on dark surface
    elevation: {
      level0: "transparent",
      level1: "rgb(32, 36, 41)", // Subtle lighter blue-tinted gray overlay
      level2: "rgb(36, 41, 48)",
      level3: "rgb(40, 46, 55)",
      level4: "rgb(41, 48, 57)",
      level5: "rgb(44, 52, 62)",
    },

    // States
    surfaceDisabled: "rgba(227, 226, 230, 0.12)", // Based on onSurface
    onSurfaceDisabled: "rgba(227, 226, 230, 0.38)", // Based on onSurface
    backdrop: "rgba(45, 49, 56, 0.4)", // Slightly cooler backdrop
  },
};
