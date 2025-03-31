import Constants from "expo-constants";
import { Platform } from "react-native";

export const getDeepLink = () => {
  const scheme = Constants.expoConfig?.extra?.scheme || "juno";
  return Platform.OS === "web" ? `${window.location.origin}/` : `${scheme}://`;
};
