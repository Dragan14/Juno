import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";

export default function Index() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the home page</Text>
    </View>
  );
}
