import { Stack, useRouter } from "expo-router";
import { useGetSession } from "@/api/useSession";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { useThemeStore } from "@/stores/themeStore";

export default function RootLayout() {
  console.log("Auth layout rendered");
  const router = useRouter();
  const session = useGetSession();
  const theme = useThemeStore((state) => state.theme);
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");

  useEffect(() => {
    if (session.isLoading) return;
    if (session.data) {
      router.replace("/(app)/(tabs)");
      return;
    }
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
      setIsWebLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [session.isLoading, session.data, router]);

  if (isWebLoading) return <LoadingScreen />;

  if (session.isLoading || session.data) return null;

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
        navigationBarColor: theme.colors.background,
      }}
    >
      <Stack.Screen name="authentication" options={{ headerShown: false }} />
    </Stack>
  );
}
