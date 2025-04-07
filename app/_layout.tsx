import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Toast } from "@/components/ui/Toast";
import { useThemeStore } from "@/stores/themeStore";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useDeepLinks } from "@/hooks/useDeepLinks";
import { NetworkHandler } from "@/components/NetworkHandler";

const queryClient = new QueryClient({});

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

function AppLayout() {
  // console.log("Root layout rendered");

  const colorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();

  // Hook to handle deep links
  useDeepLinks();

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
        <NetworkHandler>
          <Slot />
        </NetworkHandler>
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
