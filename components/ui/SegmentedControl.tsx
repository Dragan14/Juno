import { ComponentProps } from "react";
import { PixelRatio } from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useThemeStore } from "@/stores/themeStore";

type SegmentedControlProps = {
  round?: boolean;
} & ComponentProps<typeof SegmentedControlTab>;

export default function SegmentedControl({
  selectedIndex = 0,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  borderRadius,
  allowFontScaling = true,
  round = false,
  ...props
}: SegmentedControlProps) {
  const { theme } = useThemeStore();

  return (
    <SegmentedControlTab
      selectedIndex={selectedIndex}
      tabStyle={[
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.outline,
          height: scaledSize(40),
        },
        tabStyle,
      ]}
      activeTabStyle={[
        { backgroundColor: theme.colors.secondaryContainer },
        activeTabStyle,
      ]}
      tabTextStyle={[
        { color: theme.colors.onBackground, fontWeight: "500" },
        tabTextStyle,
      ]}
      activeTabTextStyle={[
        { color: theme.colors.onSecondaryContainer },
        activeTabTextStyle,
      ]}
      borderRadius={borderRadius ?? (round ? scaledSize(20) : scaledSize(5))}
      allowFontScaling={allowFontScaling}
      {...props}
    />
  );
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
