import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function AuthLayout() {
  console.log("Auth layout rendered");

  SplashScreen.hide();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
