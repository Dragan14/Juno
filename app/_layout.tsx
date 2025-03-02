import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { junoteLightTheme, junoteDarkTheme } from "../themes/junote-theme";
import Auth from "../components/Authentication";
import { useAuthStore } from "../stores/useAuthStore";
import { AppState } from "react-native";
import { supabase } from "../lib/supabase";

const queryClient = new QueryClient({});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? junoteDarkTheme : junoteLightTheme;

  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Listen for session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      setSession();
    });

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
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, [setSession]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={paperTheme}>
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            backgroundColor={paperTheme.colors.background}
          />
          {session && session.user ? (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="+not-found"
                options={{ headerShown: false }}
              />
            </Stack>
          ) : (
            <Auth />
          )}
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
