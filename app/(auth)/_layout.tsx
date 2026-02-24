import { Stack, type ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Error from "@/components/Error";
import SafeAreaView from "@/components/ui/SafeAreaView";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Error
        text={error.message || "An unexpected error has occurred."}
        onPress={retry}
        signOutButton={false}
      />
    </SafeAreaView>
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
