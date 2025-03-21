import { Stack, useRouter } from "expo-router";
import { useGetSession } from "../../hooks/useSession";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAppStateRefresh } from "../../utils/appStateRefresh";
import { useNetInfo } from "@react-native-community/netinfo";
import NoConnection from "@/components/NoConnection";
import ErrorScreen from "@/components/ErrorScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const netInfo = useNetInfo();
  const session = useGetSession();

  // Refresh the access token when the app state changes
  useAppStateRefresh();

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    } else if (!session.isLoading) {
      if (!session) {
        router.replace("/authentication");
      }
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [netInfo.isConnected, session.isLoading, session, router]);

  // No internet connection
  if (netInfo.isConnected === false) {
    return <NoConnection />;
  }

  if (session.isLoading) {
    return null;
  }

  if (session.isError) {
    return (
      <ErrorScreen
        text="Error loading session. Please try again."
        onPress={session.refetch}
      />
    );
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
