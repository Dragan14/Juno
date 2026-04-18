import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "@/context/ui/ThemeContext";
import { ToastProvider } from "@/context/ui/ToastContext";
import { AlertProvider } from "@/context/ui/AlertContext";
import { useAuthStateChange } from "@/utils/authStateChange";
import { useGetSession } from "@/api/useSession";
import { useIsPasswordRecovery } from "@/api/useAuth";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDeepLinks } from "@/hooks/useDeepLinks";
import { useTabSync } from "@/hooks/useTabSync";
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

  const { isProcessingDeepLink } = useDeepLinks();
  const isPasswordRecovery = useIsPasswordRecovery();
  useTabSync();

  useAuthStateChange();

  const isLoading =
    session.isPending || network.isLoading || isProcessingDeepLink;
  const showNoConnection = !network.isConnected && !network.isLoading;
  const showError = !isLoading && session.isError && network.isConnected;
  const showAuth =
    !isLoading && !session.data && !session.isError && network.isConnected;
  const showApp =
    !isLoading && !!session.data && !session.isError && network.isConnected;

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
        <Stack.Protected guard={showNoConnection}>
          <Stack.Screen name="noconnection" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={showError}>
          <Stack.Screen name="error" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={showAuth}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={showApp}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={showApp && isPasswordRecovery}>
          <Stack.Screen
            name="reset-password"
            options={{
              title: "Reset Password",
              headerShown: false,
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoading}>
          <Stack.Screen name="+not-found" />
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
          <GestureHandlerRootView style={{ flex: 1 }}>
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
