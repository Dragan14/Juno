import { Stack } from "expo-router";
import { useThemeStore } from "@/stores/themeStore";
import { SessionHandler } from "@/components/SessionHandler";
import { useAppStateRefresh } from "@/utils/appStateRefresh";
import { useAuthStateChange } from "@/utils/authStateChange";

export default function AppLayout() {
  // console.log("App layout rendered");
  const theme = useThemeStore((state) => state.theme);

  // Hook to listen for auth state changes, update the query cache accordingly and redirect the user
  useAuthStateChange();

  // Refresh the app state when the app is in the foreground
  useAppStateRefresh();

  return (
    <SessionHandler currentPath="app">
      <Stack
        screenOptions={{
          headerShown: false,
          navigationBarColor: theme.colors.background,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SessionHandler>
  );
}
