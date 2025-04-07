import { ComponentProps } from "react";
import { PixelRatio } from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useThemeStore } from "@/stores/themeStore";

type SegmentedControlProps = ComponentProps<typeof SegmentedControlTab>;

export default function SegmentedControl({
  selectedIndex = 0,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  borderRadius,
  allowFontScaling,
  ...props
}: SegmentedControlProps) {
  const { theme } = useThemeStore();

  return (
    <SegmentedControlTab
      selectedIndex={selectedIndex}
      tabStyle={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.outline,
        height: scaledSize(40),
      }}
      activeTabStyle={{ backgroundColor: theme.colors.secondaryContainer }}
      tabTextStyle={{ color: theme.colors.onBackground, fontWeight: "500" }}
      activeTabTextStyle={{ color: theme.colors.onSecondaryContainer }}
      borderRadius={20}
      allowFontScaling={true}
      {...props}
    />
  );
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
