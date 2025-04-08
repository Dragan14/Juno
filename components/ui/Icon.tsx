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
  switch (variant) {
    case "active":
      color = theme.colors.primary;
      break;
    case "inactive":
      color = theme.colors.onBackground;
      break;
    case "button":
      color = theme.colors.onPrimary;
      break;
    default:
      color = color ?? theme.colors.onBackground;
  }
  return <Ionicons color={color} size={scaledSize(size)} {...props} />;
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
