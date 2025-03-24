import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useThemeStore } from "@/stores/themeStore";
import LoadingScreen from "@/components/LoadingScreen";
import { Platform } from "react-native";

export default function NotFoundScreen() {
  const theme = useThemeStore((state) => state.theme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Platform.OS === "web") {
        setIsLoading(false);
      } else {
        SplashScreen.hideAsync();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (Platform.OS === "web" && isLoading) {
    return <LoadingScreen />;
  }

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
      <Text variant="headlineSmall">Oops! This page does not exist.</Text>
      <Link href="/" asChild>
        <Button mode="contained">Go back to Home screen!</Button>
      </Link>
    </View>
  );
}
