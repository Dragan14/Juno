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
import { useAuthStateChange } from "../hooks/useAuth";
import { useGetSession } from "../hooks/useSession";
import { AppState } from "react-native";
import { supabase } from "../utils/supabase";
import LoadingScreen from "../components/LoadingScreen";

const queryClient = new QueryClient({});

function AppContent() {
  useReactQueryDevTools(queryClient);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  const { data: session, isLoading } = useGetSession();
  const { authEvent } = useAuthStateChange();

  useEffect(() => {
    if (!isLoading) {
      if (authEvent?.type === "SIGNED_OUT" || !session) {
        router.replace("/authentication");
      }
    }
  }, [isLoading, session, authEvent, router]);

  useEffect(() => {
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
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
      >
        <LoadingScreen text="Loading app..." />
      </SafeAreaView>
      // TODO splash screen instead of loading screen
      // Maybe use slot
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={paperTheme.colors.background}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          {session ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen
              name="authentication"
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="+not-found"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
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
