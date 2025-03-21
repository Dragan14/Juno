import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";

export default function NoConnection() {
  const theme = useTheme();

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
