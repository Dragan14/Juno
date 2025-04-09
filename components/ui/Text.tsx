import { Text, TextProps, StyleProp, TextStyle } from "react-native";
import { useThemeStore } from "@/stores/themeStore";

type MyTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "tertiary"
    | "error"
    | "success";
  color?: string;
} & TextProps;

export default function MyText({
  children,
  style,
  variant,
  color,
  ...props
}: MyTextProps) {
  const theme = useThemeStore((state) => state.theme);

  color = (() => {
    switch (variant) {
      case "default":
        return theme.colors.onSurface;
      case "primary":
        return theme.colors.onPrimary;
      case "secondary":
        return theme.colors.onSecondary;
      case "tertiary":
        return theme.colors.onTertiary;
      case "error":
        return theme.colors.onError;
      case "success":
        return theme.colors.onSuccess;
      default:
        return color ?? theme.colors.onSurface;
    }
  })();

  return (
    <Text style={[{ color: color }, style]} {...props}>
      {children}
    </Text>
  );
}
