import { View, ViewProps } from "react-native";
import { useThemeStore } from "@/stores/themeStore";

export default function MyView({ style, ...props }: ViewProps) {
  const theme = useThemeStore((state) => state.theme);
  const color = theme.colors.background;
  return <View {...props} style={[{ backgroundColor: color }, style]} />;
}
