import { Stack, useRouter } from "expo-router";
import { useGetSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/LoadingScreen";

export default function RootLayout() {
  console.log("App layout rendered");
  const router = useRouter();
  const session = useGetSession();
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");

  useEffect(() => {
    if (session.isLoading) return;
    if (!session.data) {
      router.replace("/(auth)");
      return;
    }
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
      setIsWebLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [session.isLoading, session.data, router]);

  if (isWebLoading) return <LoadingScreen />;

  if (session.isLoading || !session.data) return null;

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
