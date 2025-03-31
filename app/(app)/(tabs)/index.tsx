import { Text } from "react-native-paper";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { useThemeStore } from "@/stores/themeStore";

export default function Home() {
  console.log("Home screen rendered");
  const theme = useThemeStore((state) => state.theme);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text>This is the home page</Text>
      <Link href="/+not-found" asChild>
        <Button mode="contained">Go to the Not Found screen!</Button>
      </Link>
      <Link href="/(auth)" asChild>
        <Button mode="contained">Go to the Authentication screen!</Button>
      </Link>
    </View>
  );
}
