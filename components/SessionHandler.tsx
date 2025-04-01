import { useGetSession } from "@/api/useSession";
import { useEffect, ReactNode } from "react";
import * as SplashScreen from "expo-splash-screen";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { Platform } from "react-native";
import { useState } from "react";
import { useSegments } from "expo-router";

interface SessionHandlerProps {
  children: ReactNode;
}

export function SessionHandler({ children }: SessionHandlerProps) {
  const session = useGetSession();
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");
  const segments = useSegments();

  const inAuthGroup = segments[0] === "(auth)";

  const isLoading =
    session.isLoading ||
    (inAuthGroup && session.data) ||
    (!inAuthGroup && !session.data);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        setIsWebLoading(false);
      }, 1500);
    }
  }, [isLoading]);

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
