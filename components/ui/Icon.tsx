import { ComponentProps } from "react";
import { PixelRatio } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";

export default function Icon({
  color,
  size,
  ...props
}: ComponentProps<typeof Ionicons>) {
  const { theme } = useThemeStore();
  color =
    color === "active"
      ? theme.colors.primary
      : color === "inactive"
        ? theme.colors.onBackground
        : color
          ? color
          : theme.colors.onBackground;
  return <Ionicons color={color} size={scaledSize(size ?? 12)} {...props} />;
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
