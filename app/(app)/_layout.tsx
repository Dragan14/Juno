import { ErrorBoundaryProps, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Error from "@/components/Error";
import SafeAreaView from "@/components/ui/SafeAreaView";
import { useIsPasswordRecovery } from "@/api/useAuth";
import { useTheme } from "@/context/ui/ThemeContext";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Error
        text={error.message || "An unexpected error has occurred."}
        onPress={retry}
        signOutButton={true}
      />
    </SafeAreaView>
  );
}

export default function AppLayout() {
  const isPasswordRecovery = useIsPasswordRecovery();
  const { theme } = useTheme();

  console.log("App layout rendered");

  SplashScreen.hide();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Protected guard={isPasswordRecovery}>
        <Stack.Screen
          name="reset-password"
          options={{
            title: "Reset Password",
            headerBackVisible: false,
            headerStyle: { backgroundColor: theme.colors.background },
            headerTitleStyle: { color: theme.colors.onBackground },
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
