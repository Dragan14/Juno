import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useAuthStateChange } from "../utils/authStateChange";
import { useAppStateRefresh } from "../utils/appStateRefresh";

const queryClient = new QueryClient({});

function AppContent() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  useAuthStateChange();
  useAppStateRefresh();

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={paperTheme.colors.background}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
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
