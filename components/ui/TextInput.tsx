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
  outlined?: boolean;
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

  const borderColor = (() => {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    } else if (error) {
      return theme.colors.error;
    } else if (isFocused) {
      return theme.colors.primary;
    } else {
      return theme.colors.onBackground;
    }
  })();

  const containerBorder = outlined
    ? {
        ...styles.outlinedBorder,
        borderColor,
      }
    : {
        ...styles.standardBorder,
        borderBottomColor: borderColor,
      };

  const labelStyleColor = (() => {
    if (disabled) {
      return { color: theme.colors.onSurfaceDisabled };
    }
    if (error) {
      return { color: theme.colors.error };
    }
    if (isFocused) {
      return { color: theme.colors.primary };
    }
    return { color: theme.colors.onBackground };
  })();

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
        color={color ?? theme.colors.onBackground}
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
        {label && !outlined && (
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
            <View style={styles.leftIcons}>{renderIcon(leftIcon)}</View>
          )}
          <TextInput
            ref={inputRef}
            style={[
              textStyle,
              styles.textInput,
              { color: theme.colors.onBackground },
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
          {rightIcon && (
            <View style={styles.rightIcons}>{renderIcon(rightIcon)}</View>
          )}
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
  leftIcons: {
    flexDirection: "row",
    paddingRight: 8,
  },
  rightIcons: {
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
