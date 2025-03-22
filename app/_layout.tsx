import "../wdyr";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useAuthStateChange } from "../utils/authStateChange";
import { Toast } from "../components/Toast";
import { useThemeStore } from "@/stores/themeStore";

const queryClient = new QueryClient({});

function AppLayout() {
  /// Hook to listen for auth state changes, update the query cache accordingly and redirect the user
  useAuthStateChange();
  const { theme, colorScheme } = useThemeStore();

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
