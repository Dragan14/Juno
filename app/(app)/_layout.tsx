import { Stack } from "expo-router";
import { useThemeStore } from "@/stores/themeStore";
import { SessionHandler } from "@/components/SessionHandler";

export default function AppLayout() {
  console.log("App layout rendered");
  const theme = useThemeStore((state) => state.theme);

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
