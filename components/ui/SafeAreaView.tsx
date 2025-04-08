// https://github.com/AppAndFlow/react-native-safe-area-context/issues/114
import React, { FunctionComponent } from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

type SafeAreaViewProps = {
  disableBottomSafeArea?: boolean;
  disableTopSafeArea?: boolean;
  disableSidesSafeArea?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
} & ViewStyle;

export const SafeAreaView: FunctionComponent<SafeAreaViewProps> = ({
  disableBottomSafeArea,
  disableTopSafeArea,
  disableSidesSafeArea,
  children,
  style,
  ...props
}: SafeAreaViewProps) => {
  const theme = useThemeStore((state) => state.theme);

  const insets = useSafeAreaInsets();

  style = StyleSheet.flatten([
    style,
    { flex: 1, backgroundColor: theme.colors.background },
  ]);

  if (!disableBottomSafeArea) {
    style.paddingBottom = insets.bottom;
  }

  if (!disableTopSafeArea) {
    style.paddingTop = insets.top;
  }

  if (!disableSidesSafeArea) {
    style.paddingRight = insets.right;
    style.paddingLeft = insets.left;
  }

  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};
