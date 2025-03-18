import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Index() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}></View>
  );
}
