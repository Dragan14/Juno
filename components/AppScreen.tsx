import { ReactNode } from "react";
import { ViewStyle, StyleProp } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

interface AppScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppScreen: React.FC<AppScreenProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        style, // Allow for style overrides
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export default AppScreen;
