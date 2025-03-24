import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useAuthStateChange } from "../utils/authStateChange";
import { Toast } from "../components/Toast";
import { useThemeStore } from "@/stores/themeStore";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

const queryClient = new QueryClient({});

SplashScreen.preventAutoHideAsync();

function AppLayout() {
  /// Hook to listen for auth state changes, update the query cache accordingly and redirect the user
  useAuthStateChange();

  const colorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    }
  }, [colorScheme, setTheme]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor={theme.colors.background}
        />
        <Slot />
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout />
    </QueryClientProvider>
  );
}
