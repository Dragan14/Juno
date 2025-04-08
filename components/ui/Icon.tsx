import { ComponentProps } from "react";
import { PixelRatio } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";

type IconProps = {
  variant?: "active" | "inactive" | "button";
  color?: string;
  size?: number;
} & ComponentProps<typeof Ionicons>;

export default function Icon({
  variant,
  color,
  size = 24,
  ...props
}: IconProps) {
  const { theme } = useThemeStore();

  color = (() => {
    switch (variant) {
      case "active":
        return theme.colors.primary;
      case "inactive":
        return theme.colors.onBackground;
      case "button":
        return theme.colors.onPrimary;
      default:
        return color ?? theme.colors.onBackground;
    }
  })();

  return <Ionicons color={color} size={scaledSize(size)} {...props} />;
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
