import { Stack } from "expo-router";
import { useThemeStore } from "@/stores/themeStore";
import { SessionHandler } from "@/components/SessionHandler";

export default function AuthLayout() {
  console.log("Auth layout rendered");
  const theme = useThemeStore((state) => state.theme);

  return (
    <SessionHandler>
      <Stack
        screenOptions={{
          headerShown: false,
          navigationBarColor: theme.colors.background,
        }}
      >
        <Stack.Screen name="authentication" options={{ headerShown: false }} />
      </Stack>
    </SessionHandler>
  );
}
