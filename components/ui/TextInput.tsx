import React, { useRef, useState, ComponentProps } from "react";
import {
  View,
  ViewStyle,
  Text,
  TextInput,
  TextStyle,
  StyleSheet,
  StyleProp,
  TextInputProps,
  Pressable,
  PixelRatio,
  Platform,
} from "react-native";
import { useThemeStore } from "@/stores/themeStore";
import { Ionicons } from "@expo/vector-icons";

type MyTextInputProps = {
  label?: string;
  leftIcon?: ComponentProps<typeof Ionicons> | null;
  rightIcon?: ComponentProps<typeof Ionicons> | null;
  error?: boolean;
  errorMessage?: string;
  retainErrorMessageSpace?: boolean;
  variant?: "clear" | "outlined" | "solid";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<TextInput>) => void;
  onFocus?: (e: React.FocusEvent<TextInput>) => void;
} & TextInputProps;

export default function MyTextInput({
  label,
  leftIcon,
  rightIcon,
  error,
  errorMessage,
  retainErrorMessageSpace = true,
  variant = "outlined",
  style,
  textStyle,
  disabled,
  onBlur,
  onFocus,
  ...props
}: MyTextInputProps) {
  const { theme } = useThemeStore();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = (() => {
    if (disabled) return theme.colors.onBackground;
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.onBackground;
  })();

  // Container border style based on variant
  const containerBorder =
    variant === "outlined"
      ? {
          ...styles.outlinedBorder,
          borderColor,
        }
      : {
          // clear and solid variants only have bottom border
          ...styles.clearBorder,
          borderBottomColor: borderColor,
        };

  // Determine base text/label/icon colors based on variant
  const baseTextColor =
    variant === "solid"
      ? theme.colors.onSurfaceVariant
      : theme.colors.onBackground;
  const containerBackgroundColor =
    variant === "solid" ? theme.colors.surfaceVariant : "transparent";
  const labelBackgroundColor =
    variant === "solid" ? "transparent" : theme.colors.background;
  const labelStyleColor = (() => {
    if (disabled) return theme.colors.onSurfaceDisabled;
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return baseTextColor;
  })();

  // Adjust padding and icon positions based on variant
  const isOutlined = variant === "outlined";
  const containerPaddingTop = isOutlined || !label ? 0 : scaledSize(15);
  const labelTop = isOutlined ? scaledSize(-8) : scaledSize(4);
  const labelLeft = isOutlined
    ? scaledSize(9)
    : leftIcon
      ? scaledSize(38)
      : scaledSize(6);
  const iconTop = isOutlined || !label ? 0 : scaledSize(-8);

  const renderIcon = ({
    name,
    size = 24,
    color,
    style,
    ...props
  }: ComponentProps<typeof Ionicons>) => {
    return (
      <Ionicons
        name={name}
        size={scaledSize(size)}
        color={color ?? baseTextColor}
        style={style}
        {...props}
      />
    );
  };

  return (
    <View style={style}>
      <Pressable
        onPress={() => {
          if (!disabled) {
            inputRef.current?.focus();
          }
        }}
        disabled={disabled}
      >
        {label && (
          <Text
            style={[
              styles.label,
              {
                backgroundColor: labelBackgroundColor,
                color: labelStyleColor,
                top: labelTop,
                left: labelLeft,
              },
            ]}
          >
            {label}
          </Text>
        )}
        <View
          style={[
            styles.container,
            containerBorder,
            {
              backgroundColor: containerBackgroundColor,
              opacity: disabled ? 0.5 : 1,
              paddingTop: containerPaddingTop,
            },
          ]}
        >
          {leftIcon && (
            <View style={[styles.leftIcon, { top: iconTop }]}>
              {renderIcon(leftIcon)}
            </View>
          )}
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: baseTextColor }, textStyle]}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            editable={!disabled}
            {...props}
          />
          {rightIcon && (
            <View style={[styles.rightIcon, { top: iconTop }]}>
              {renderIcon(rightIcon)}
            </View>
          )}
        </View>
      </Pressable>
      {(error || retainErrorMessageSpace) && (
        <View style={styles.errorContainer}>
          {error && errorMessage ? (
            <Text style={[styles.errorMessage, { color: theme.colors.error }]}>
              {errorMessage}
            </Text>
          ) : (
            retainErrorMessageSpace && <View style={styles.errorPlaceholder} />
          )}
        </View>
      )}
    </View>
  );
}

const scaledSize = (baseSize: number) => {
  // Consider adding Math.max(1, ...) if you never want scaled size to be 0 or negative unexpectedly
  return Math.round(baseSize * PixelRatio.getFontScale());
};

const styles = StyleSheet.create({
  container: {
    height: scaledSize(50),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  label: {
    position: "absolute",
    paddingHorizontal: 4,
    fontWeight: "500",
    fontSize: 12,
    zIndex: 1,
  },
  leftIcon: {
    flexDirection: "row",
    paddingRight: 8,
  },
  rightIcon: {
    flexDirection: "row",
    paddingLeft: 8,
  },
  textInput: {
    flex: 1,
    height: "100%",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
    textAlignVertical: "center",
  },
  outlinedBorder: {
    borderRadius: 5,
    borderWidth: 1,
  },
  clearBorder: {
    borderBottomWidth: 1,
  },
  errorContainer: {
    height: scaledSize(23),
    paddingHorizontal: 10,
  },
  errorMessage: {
    fontSize: 12,
  },
  errorPlaceholder: {
    height: "100%",
  },
});
