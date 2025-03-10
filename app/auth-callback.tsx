import { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { Text, ActivityIndicator, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSetSession } from "../hooks/useAuth";
import * as Linking from "expo-linking";

export default function AuthCallback() {
  const router = useRouter();
  const theme = useTheme();
  const setSession = useSetSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Process the auth callback
    const handleAuthCallback = async () => {
      try {
        if (Platform.OS === "web") {
          // For web get URL parameters from the hash fragment
          if (
            window.location.hash &&
            window.location.hash.includes("access_token")
          ) {
            // Parse the hash fragment to extract tokens
            const hashParams = new URLSearchParams(
              window.location.hash.substring(1), // Remove the # character
            );

            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");

            if (accessToken && refreshToken) {
              await processTokens(accessToken, refreshToken);
              return;
            }
          }
        } else {
          // For native get URL parameters from the deep link
          const url = await Linking.getInitialURL();
          if (url) {
            const parsedUrl = Linking.parse(url);

            let accessToken = parsedUrl.queryParams?.access_token;
            let refreshToken = parsedUrl.queryParams?.refresh_token;

            if (accessToken && refreshToken) {
              if (Array.isArray(accessToken)) accessToken = accessToken[0];
              if (Array.isArray(refreshToken)) refreshToken = refreshToken[0];

              await processTokens(accessToken, refreshToken);
              return;
            }
          }
        }
      } catch {
        setError("An unexpected error occurred");
        router.replace("/authentication");
      }
    };

    const processTokens = async (accessToken: string, refreshToken: string) => {
      try {
        await setSession.mutateAsync({
          accessToken,
          refreshToken,
        });
        setTimeout(() => {
          router.replace("/");
        }, 100);
      } catch (error: any) {
        setError(error?.message || "Error processing authentication");
        router.replace("/authentication");
      }
    };

    handleAuthCallback();
  }, [router, setSession]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {error ? (
          <>
            <Text variant="headlineSmall">Authentication Error</Text>
            <Text variant="bodyMedium">{error}</Text>
            <Text variant="bodyMedium">Redirecting you back to sign in...</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" />
            <Text variant="headlineSmall">Verifying your account...</Text>
          </>
        )}
      </View>
    </View>
  );
}
