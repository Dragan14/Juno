import { Text, TextProps, StyleProp, TextStyle } from "react-native";
import { useThemeStore } from "@/stores/themeStore";

type MyTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
} & TextProps;

export default function MyText({ children, style, ...props }: MyTextProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Text style={[style, { color: theme.colors.onSurface }]} {...props}>
      {children}
    </Text>
  );
}
