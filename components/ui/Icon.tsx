import { ComponentProps } from "react";
import { PixelRatio } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";

type IconProps = ComponentProps<typeof Ionicons> & {
  active?: boolean;
};

export default function Icon({ active, ...props }: IconProps) {
  const { theme } = useThemeStore();
  const color = active ? theme.colors.primary : theme.colors.onBackground;
  return (
    <Ionicons
      {...props}
      color={color}
      size={scaledSize(props.size ? props.size : 24)}
    />
  );
}

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};
