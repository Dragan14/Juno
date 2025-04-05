import { Stack } from "expo-router";
import { useThemeStore } from "@/stores/themeStore";
import { SessionHandler } from "@/components/SessionHandler";
import { useAuthStateChange } from "@/utils/authStateChange";

export default function AuthLayout() {
  // console.log("Auth layout rendered");
  const theme = useThemeStore((state) => state.theme);

  // Hook to listen for auth state changes, update the query cache accordingly and redirect the user
  useAuthStateChange();

  return (
    <SessionHandler currentPath="auth">
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
