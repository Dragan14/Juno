import { Stack, type ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Error from "@/components/Error";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Error
      text={error.message || "An unexpected error has occurred."}
      onPress={retry}
      signOutButton={false}
    />
  );
}

export default function AuthLayout() {
  console.log("Auth layout rendered");

  SplashScreen.hide();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
