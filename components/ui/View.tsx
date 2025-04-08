import { View, ViewProps } from "react-native";
import { useThemeStore } from "@/stores/themeStore";

export default function MyView({ style, ...props }: ViewProps) {
  const theme = useThemeStore((state) => state.theme);
  const { colors } = theme;
  return (
    <View {...props} style={[{ backgroundColor: colors.background }, style]} />
  );
}
