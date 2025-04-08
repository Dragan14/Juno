import React, { useRef, useState } from "react";
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

interface CustomTextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  retainErrorMessageSpace?: boolean;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

type MyTextInputProps = CustomTextInputProps & TextInputProps;

export default function MyTextInput({
  label,
  leftIcon,
  rightIcon,
  error,
  errorMessage,
  retainErrorMessageSpace = true,
  outlined,
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

  const containerBorder = outlined
    ? {
        ...styles.outlinedBorder,
        borderColor: error
          ? theme.colors.error
          : isFocused
            ? theme.colors.primary
            : theme.colors.onBackground,
      }
    : {
        ...styles.standardBorder,
        borderBottomColor: error
          ? theme.colors.error
          : isFocused
            ? theme.colors.primary
            : theme.colors.onBackground,
      };

  const labelStyleColor = {
    color: disabled
      ? theme.colors.onSurfaceDisabled
      : error
        ? theme.colors.error
        : isFocused
          ? theme.colors.primary
          : theme.colors.onBackground,
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
                backgroundColor: theme.colors.background,
                color: labelStyleColor.color,
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
              backgroundColor: "transparent",
              opacity: disabled ? 0.6 : 1,
            },
          ]}
        >
          {leftIcon && (
            <View style={styles.leftIcon} pointerEvents="none">
              {leftIcon}
            </View>
          )}
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              { color: theme.colors.onBackground },
              textStyle,
            ]}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur && onBlur(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus && onFocus(e);
            }}
            editable={!disabled}
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      </Pressable>
      {(error || retainErrorMessageSpace) && (
        <View style={styles.errorContainer}>
          {error ? (
            <Text style={[styles.errorMessage, { color: theme.colors.error }]}>
              {errorMessage}
            </Text>
          ) : (
            <View style={styles.errorPlaceholder} />
          )}
        </View>
      )}
    </View>
  );
}

const scaledSize = (baseSize: number) => {
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
    top: scaledSize(-8),
    left: scaledSize(10),
    paddingHorizontal: 4,
    fontWeight: "500",
    fontSize: 12,
    zIndex: 1,
  },
  leftIcon: {
    paddingRight: 8,
  },
  rightIcon: {
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
  },
  outlinedBorder: {
    borderRadius: 5,
    borderWidth: 1,
  },
  standardBorder: {
    borderBottomWidth: 1,
  },
  errorContainer: {
    height: scaledSize(23),
  },
  errorMessage: {
    fontSize: 12,
  },
  errorPlaceholder: {
    height: "100%",
  },
});
