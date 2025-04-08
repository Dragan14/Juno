import React, { forwardRef } from "react";
import {
  Pressable,
  PressableProps,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  PixelRatio,
} from "react-native";
import { useThemeStore } from "@/stores/themeStore";

type ButtonProps = {
  children?: string;
  color?: string;
  textColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outlined"
    | "success"
    | "error"
    | "elevated";
} & PressableProps;

const Button = forwardRef<View, ButtonProps>(
  (
    {
      children,
      color,
      textColor,
      leftIcon,
      rightIcon,
      loading = false,
      style,
      textStyle,
      disabled,
      variant,
      ...props
    },
    ref,
  ) => {
    const theme = useThemeStore((state) => state.theme);

    const backgroundColor = (() => {
      if (disabled) return theme.colors.surfaceDisabled;
      switch (variant) {
        case "success":
          return theme.colors.success;
        case "error":
          return theme.colors.error;
        case "outlined":
          return "transparent";
        case "primary":
          return theme.colors.primary;
        case "secondary":
          return theme.colors.secondary;
        case "tertiary":
          return theme.colors.tertiary;
        case "elevated":
          return theme.colors.elevation.level1;
        default:
          return color ?? theme.colors.primary;
      }
    })();

    const contentColor = (() => {
      if (disabled) return theme.colors.onSurfaceDisabled;
      switch (variant) {
        case "success":
          return theme.colors.onSuccess;
        case "error":
          return theme.colors.onError;
        case "outlined":
          return theme.colors.primary;
        case "primary":
          return theme.colors.onPrimary;
        case "secondary":
          return theme.colors.onSecondary;
        case "tertiary":
          return theme.colors.onTertiary;
        case "elevated":
          return theme.colors.primary;
        default:
          return textColor ?? theme.colors.onPrimary;
      }
    })();

    return (
      <Pressable
        ref={ref}
        style={({ pressed, hovered }) => [
          styles.button,
          { backgroundColor },
          variant === "outlined" && {
            borderWidth: 1,
            borderColor: theme.colors.outline,
          },
          !disabled && hovered && styles.hovered,
          !disabled && pressed && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
        disabled={disabled}
        {...props}
      >
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={contentColor} />
          ) : (
            <>
              {leftIcon && <View style={styles.iconSpacing}>{leftIcon}</View>}
              <Text
                style={[styles.text, { color: contentColor }, textStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {children}
              </Text>
              {rightIcon && <View style={styles.iconSpacing}>{rightIcon}</View>}
            </>
          )}
        </View>
      </Pressable>
    );
  },
);

Button.displayName = "Button";

export default Button;

const scaledSize = (baseSize: number) => {
  return Math.round(baseSize * PixelRatio.getFontScale());
};

const styles = StyleSheet.create({
  button: {
    height: scaledSize(40),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    minWidth: scaledSize(80),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scaledSize(24),
    marginVertical: scaledSize(10),
    flex: 1,
  },
  hovered: {
    opacity: 0.9,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontWeight: "500",
    textAlign: "center",
    flexShrink: 1,
  },
  iconSpacing: {
    marginHorizontal: scaledSize(6),
  },
});
