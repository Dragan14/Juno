import { Platform } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const netInfo = useNetInfo();

  const isLoading =
    netInfo.isConnected === null ||
    netInfo.isInternetReachable === null ||
    (Platform.OS === "android" && netInfo.isWifiEnabled === null);

  const isConnected =
    netInfo.isConnected === true &&
    netInfo.isInternetReachable === true &&
    (Platform.OS !== "android" || netInfo.isWifiEnabled === true);

  return {
    isLoading,
    isConnected,
  };
}
