import "../wdyr";
import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useThemeStore } from "@/stores/themeStore";

export default function NotFoundScreen() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
