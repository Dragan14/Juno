import { Stack, useRouter } from "expo-router";
import { useGetSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNetInfo } from "@react-native-community/netinfo";
import NoConnection from "@/components/NoConnection";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/LoadingScreen";

export default function RootLayout() {
  const router = useRouter();
  const netInfo = useNetInfo();
  const session = useGetSession();
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setTimeout(() => {
        setIsWebLoading(false);
        SplashScreen.hideAsync();
      }, 1500);
    } else if (!session.isLoading && netInfo.isConnected !== null) {
      if (session.data) {
        router.replace("/(app)/(tabs)");
      }
      setTimeout(() => {
        setIsWebLoading(false);
        SplashScreen.hideAsync();
      }, 1500);
    }
  }, [netInfo.isConnected, session.isLoading, session.data, router]);

  // No internet connection
  if (netInfo.isConnected === false) {
    return <NoConnection />;
  }

  if (isWebLoading) {
    return <LoadingScreen />;
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
