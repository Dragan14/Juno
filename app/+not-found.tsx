import { Text } from "react-native-paper";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import LoadingScreen from "@/components/LoadingScreen";
import { Platform } from "react-native";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";

export default function NotFoundScreen() {
  // console.log("Not Found screen rendered");
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");

  useEffect(() => {
    setTimeout(() => {
      setIsWebLoading(false);
      SplashScreen.hideAsync();
    }, 1500);
  }, []);

  if (isWebLoading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text variant="headlineSmall">Oops! This page does not exist.</Text>
      <Link href="/" asChild>
        <Button>Go back to Home screen!</Button>
      </Link>
    </View>
  );
}
