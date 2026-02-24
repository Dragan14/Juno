import { ErrorBoundaryProps, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Error from "@/components/Error";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Error
      text={error.message || "An unexpected error has occurred."}
      onPress={retry}
      signOutButton={true}
    />
  );
}

export default function AppLayout() {
  console.log("App layout rendered");

  SplashScreen.hide();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
