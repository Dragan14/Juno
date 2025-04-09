import React, { forwardRef, ForwardedRef } from "react";
import { Text, TextProps, StyleProp, TextStyle, Pressable } from "react-native";
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
  link?: boolean;
} & TextProps;

const MyText = forwardRef(
  (
    { children, style, variant, color, link, onPress, ...props }: MyTextProps,
    ref: ForwardedRef<Text>,
  ) => {
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

    return link ? (
      <Pressable onPress={onPress}>
        {({ pressed, hovered }) => (
          <Text
            ref={ref}
            style={[
              { color: color },
              pressed || hovered ? { textDecorationLine: "underline" } : {},
              style,
            ]}
            {...props}
          >
            {children}
          </Text>
        )}
      </Pressable>
    ) : (
      <Text ref={ref} style={[{ color: color }, style]} {...props}>
        {children}
      </Text>
    );
  },
);

MyText.displayName = "Text";

export default MyText;
