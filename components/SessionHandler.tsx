import { useGetSession } from "@/api/useSession";
import { useEffect, ReactNode } from "react";
import * as SplashScreen from "expo-splash-screen";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

interface SessionHandlerProps {
  children: ReactNode;
  currentPath: string;
}

export function SessionHandler({ children, currentPath }: SessionHandlerProps) {
  // console.log("Session handler rendered");
  const session = useGetSession();
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");
  const router = useRouter();
  const inAuthGroup = currentPath === "auth";
  const inAppGroup = currentPath === "app";

  const isLoading =
    session.isPending ||
    (inAuthGroup && session.data) ||
    (inAppGroup && !session.data);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        setIsWebLoading(false);
      }, 1500);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!session.isFetching) {
      if (!session.data && inAppGroup) {
        // console.log("User is not authenticated, redirecting to auth");
        router.replace("/(auth)/authentication");
      } else if (session.data && inAuthGroup) {
        // console.log("User is authenticated, redirecting to app");
        router.replace("/(app)/(tabs)");
      }
    }
  }, [session.isFetching, session.data, inAuthGroup, inAppGroup, router]);

  if (isWebLoading) return <LoadingScreen />;

  if (isLoading) return null;

  if (session.isError) {
    return (
      <ErrorScreen
        text="Error loading session. Please try again."
        onPress={session.refetch}
      />
    );
  }

  return <>{children}</>;
}
