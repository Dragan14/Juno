import { Stack, useRouter } from "expo-router";
import { useGetSession } from "../../hooks/useSession";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAppStateRefresh } from "../../utils/appStateRefresh";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const { data: session, isLoading } = useGetSession();

  // Refresh the access token when the app state changes
  useAppStateRefresh();

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.replace("/authentication");
      } else {
        SplashScreen.hideAsync();
      }
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
