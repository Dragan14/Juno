import { ReactNode } from "react";
import * as SplashScreen from "expo-splash-screen";
import LoadingScreen from "@/components/LoadingScreen";
import { Platform } from "react-native";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import NoConnection from "@/components/NoConnection";

interface NetworkHandlerProps {
  children: ReactNode;
}

export function NetworkHandler({ children }: NetworkHandlerProps) {
  const { isLoading, isConnected } = useNetworkStatus();

  if (isLoading) {
    if (Platform.OS === "web") {
      return <LoadingScreen />;
    }
    return null;
  }
  if (!isConnected) {
    SplashScreen.hideAsync();
    return <NoConnection />;
  }
  return <>{children}</>;
}
