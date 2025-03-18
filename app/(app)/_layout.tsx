import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetSession } from "../../hooks/useSession";
import { useTheme } from "react-native-paper";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAppStateRefresh } from "../../utils/appStateRefresh";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const router = useRouter();

  const { data: session, isLoading } = useGetSession();

  console.log("here");

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.replace("/authentication");
      }
      // Hide the splash screen once navigation has been triggered
      SplashScreen.hideAsync();
    }
  }, [isLoading, session, router]);

  // Refresh the access token when the app state changes
  useAppStateRefresh();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
