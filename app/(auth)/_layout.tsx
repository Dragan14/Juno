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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      if (Platform.OS === "web") {
        setIsLoading(false);
      } else {
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 1000);
      }
    } else if (!session.isLoading && netInfo.isConnected !== null) {
      if (session.data) {
        router.replace("/(app)/(tabs)");
      }
      if (Platform.OS === "web") {
        setIsLoading(false);
      } else {
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 1000);
      }
    }
  }, [netInfo.isConnected, session.isLoading, session.data, router]);

  // No internet connection
  if (netInfo.isConnected === false) {
    return <NoConnection />;
  }

  if (Platform.OS === "web" && isLoading) {
    return <LoadingScreen />;
  }

  if (session.isLoading) {
    if (Platform.OS === "web") {
      return <LoadingScreen />;
    }
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
      <Stack.Screen name="authentication" options={{ headerShown: false }} />
    </Stack>
  );
}
