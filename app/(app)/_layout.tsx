import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function AppLayout() {
  // console.log("App layout rendered");

  SplashScreen.hide();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
