import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { useSession, useAuthStateChange } from "../hooks/useAuth";
import { AppState } from "react-native";
import { supabase } from "../utils/supabase";
import LoadingScreen from "../components/LoadingScreen";

const queryClient = new QueryClient({});

// Create a separate component for content that uses React Query hooks
function AppContent() {
  useReactQueryDevTools(queryClient);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  // Get the current session
  const { data: session, isLoading } = useSession();

  const { authEvent } = useAuthStateChange();

  useEffect(() => {
    if (isLoading) return;

    if (session) {
      router.replace("/");
      return;
    }

    // Handle authentication state changes
    if (authEvent?.type === "SIGNED_OUT") {
      router.replace("/authentication");
    } else if (!session) {
      router.replace("/authentication");
    }
  }, [isLoading, session, authEvent, router]);

  useEffect(() => {
    // Handle app state changes for auto-refresh
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          supabase.auth.startAutoRefresh();
        } else {
          supabase.auth.stopAutoRefresh();
        }
      },
    );
    // Return a cleanup function
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={paperTheme.colors.background}
      />
      {isLoading ? (
        <SafeAreaView>
          <LoadingScreen text="Loading app..." />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="authentication"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="confirm-email"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="auth-callback"
              options={{ headerShown: false }}
            />
          </Stack>
        </SafeAreaView>
      )}
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
