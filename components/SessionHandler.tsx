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
  console.log("Session handler rendered");
  const session = useGetSession();
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");
  const router = useRouter();
  const inAuthGroup = currentPath === "auth";
  const inAppGroup = currentPath === "app";

  console.log("session", session);

  const isLoading =
    session.isPending ||
    (inAuthGroup && session.data) ||
    (inAppGroup && !session.data);

  useEffect(() => {
    console.log("Session handler isLoading useEffect");
    if (!isLoading) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        setIsWebLoading(false);
      }, 1500);
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("Session handler navigation useEffect");
    if (!session.isFetching) {
      if (!session.data && !inAuthGroup) {
        router.replace("/(auth)/authentication");
      } else if (session.data && !inAppGroup) {
        router.replace("/(app)/(tabs)");
      }
    }
  }, [session.isFetching, session.data, inAuthGroup, inAppGroup, router]);

  if (isLoading) {
    return Platform.OS === "web" && isWebLoading ? <LoadingScreen /> : null;
  }

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
