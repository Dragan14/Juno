import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";

type IconProps = ComponentProps<typeof Ionicons> & {
  active?: boolean;
};

export default function Icon({ active, ...props }: IconProps) {
  const { theme } = useThemeStore();
  const color = active ? theme.colors.primary : theme.colors.onBackground;
  return <Ionicons {...props} color={color} />;
}
