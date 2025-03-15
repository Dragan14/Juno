import Constants from "expo-constants";
import { Platform } from "react-native";

export const getAuthCallbackUrl = () => {
  const scheme = Constants.expoConfig?.extra?.scheme || "juno";
  return Platform.OS === "web"
    ? `${window.location.origin}/auth-callback`
    : `${scheme}://auth-callback`;
};
