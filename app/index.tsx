import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useGetSession } from "../hooks/useSession";
import * as SplashScreen from "expo-splash-screen";
import { useTheme } from "react-native-paper";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const theme = useTheme();
  const router = useRouter();
  const { data: session, isLoading } = useGetSession();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)");
      }
      // Hide the splash screen once navigation has been triggered
      SplashScreen.hideAsync();
    }
  }, [isLoading, session, router]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}></View>
  );
}
