import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AlertProvider } from "@/context/AlertContext";
import { useAuthStateChange } from "@/utils/authStateChange";
import { useGetSession } from "@/api/useSession";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDeepLinks } from "@/hooks/useDeepLinks";
import * as WebBrowser from "expo-web-browser";

const queryClient = new QueryClient({});

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

WebBrowser.maybeCompleteAuthSession();

function AppLayout() {
  console.log("Root layout rendered");

  const { theme, isDark } = useTheme();

  const network = useNetworkStatus();

  const session = useGetSession();

  useDeepLinks();

  useAuthStateChange();

  if (session.isPending || network.isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          navigationBarColor: theme.colors.background,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { color: theme.colors.onBackground },
        }}
      >
        <Stack.Protected guard={!network.isConnected && !network.isLoading}>
          <Stack.Screen name="noconnection" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={session.isError && !session.isPending}>
          <Stack.Screen name="error" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!session.data && !session.isPending}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!session.data && !session.isPending}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <ToastProvider>
              <AlertProvider>
                <AppLayout />
              </AlertProvider>
            </ToastProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
