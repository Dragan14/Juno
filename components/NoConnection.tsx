import { View } from "react-native";
import { Text } from "react-native-paper";
import { useThemeStore } from "@/stores/themeStore";

export default function NoConnection() {
  console.log("No connection screen rendered");
  const theme = useThemeStore((state) => state.theme);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text>No internet connection</Text>
    </View>
  );
}
