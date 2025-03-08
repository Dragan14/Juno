import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  Provider as PaperProvider,
  ActivityIndicator,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { useSession, useAuthStateChange } from "../hooks/useAuth";
import { AppState } from "react-native";
import { supabase } from "../lib/supabase";

const queryClient = new QueryClient({});

// Create a separate component for content that uses React Query hooks
function AppContent() {
  useReactQueryDevTools(queryClient);

  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  // Get the current session
  const { data: session, isLoading } = useSession();

  // Handle auth state changes
  useAuthStateChange();

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
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: paperTheme.colors.background,
          }}
        >
          <ActivityIndicator animating={true} size="large" />
        </SafeAreaView>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
            redirect={!session || !session.user}
          />
          <Stack.Screen
            name="authentication"
            options={{ headerShown: false }}
            redirect={!!(session && session.user)}
          />
          <Stack.Screen name="confirm-email" options={{ headerShown: false }} />
          <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
        </Stack>
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
