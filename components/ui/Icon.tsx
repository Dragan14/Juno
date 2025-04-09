import { ComponentProps } from "react";
import { PixelRatio } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";

type IconProps = {
  variant?: "active" | "inactive";
  color?: string;
  size?: number;
  allowIconScaling?: boolean;
} & ComponentProps<typeof Ionicons>;

export default function Icon({
  variant,
  color,
  size = 24,
  allowIconScaling = true,
  ...props
}: IconProps) {
  const { theme } = useThemeStore();

  color = (() => {
    switch (variant) {
      case "active":
        return theme.colors.primary;
      case "inactive":
        return theme.colors.onBackground;
      default:
        return color ?? theme.colors.onBackground;
    }
  })();

  return (
    <Ionicons
      color={color}
      size={allowIconScaling ? scaledSize(size) : size}
      {...props}
    />
  );
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
