import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

interface CustomViewProps extends ViewProps {
  isSafeArea?: boolean;
}

export default function MyView({
  isSafeArea = false,
  ...props
}: CustomViewProps) {
  const theme = useThemeStore((state) => state.theme);
  const { colors } = theme;
  if (!isSafeArea) {
    return (
      <View
        {...props}
        style={[{ backgroundColor: colors.background }, props.style]}
      />
    );
  }
  return (
    <SafeAreaView
      {...props}
      style={[{ backgroundColor: colors.background, flex: 1 }, props.style]}
    />
  );
}
