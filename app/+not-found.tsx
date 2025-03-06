import { Button, Text, useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="headlineSmall">Oops! This page does not exist.</Text>
      <Link href="/" asChild>
        <Button mode="contained">Go back to Home screen!</Button>
      </Link>
    </SafeAreaView>
  );
}
