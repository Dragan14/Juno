import { Platform } from "react-native";
import NoConnection from "@/components/NoConnection";
import LoadingScreen from "@/components/LoadingScreen";
import * as SplashScreen from "expo-splash-screen";
import type { NetInfoState } from "@react-native-community/netinfo";

export function renderNetworkStatus(netInfo: NetInfoState) {
  if (netInfo.isConnected === null) {
    if (Platform.OS === "web") {
      return <LoadingScreen />;
    }
    return null;
  }
  if (netInfo.isConnected === false) {
    SplashScreen.hideAsync();
    return <NoConnection />;
  }
  return null;
}
