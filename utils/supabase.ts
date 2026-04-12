import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseSource = (
  process.env.EXPO_PUBLIC_SUPABASE_SOURCE ?? "cloud"
).toLowerCase();
const useLocalSupabase = supabaseSource === "local";

const baseSupabaseUrl = useLocalSupabase
  ? process.env.EXPO_PUBLIC_SUPABASE_URL_LOCAL
  : process.env.EXPO_PUBLIC_SUPABASE_URL;
const baseSupabaseAnonKey = useLocalSupabase
  ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_LOCAL
  : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const platformSupabaseUrl = Platform.select({
  android: process.env.EXPO_PUBLIC_SUPABASE_URL_ANDROID,
  ios: process.env.EXPO_PUBLIC_SUPABASE_URL_IOS,
  web: process.env.EXPO_PUBLIC_SUPABASE_URL_WEB,
  default: undefined,
});

if (!baseSupabaseUrl) {
  throw new Error(
    useLocalSupabase
      ? "Missing EXPO_PUBLIC_SUPABASE_URL_LOCAL environment variable"
      : "Missing EXPO_PUBLIC_SUPABASE_URL environment variable",
  );
}

if (!baseSupabaseAnonKey) {
  throw new Error(
    useLocalSupabase
      ? "Missing EXPO_PUBLIC_SUPABASE_ANON_KEY_LOCAL environment variable"
      : "Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable",
  );
}

const resolvedSupabaseUrl = platformSupabaseUrl ?? baseSupabaseUrl;

const getAndroidSafeUrl = (urlString: string) => {
  if (Platform.OS !== "android") {
    return urlString;
  }

  try {
    const url = new URL(urlString);
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
      url.hostname = "10.0.2.2";
    }
    return url.toString();
  } catch {
    return urlString
      .replace("http://127.0.0.1", "http://10.0.2.2")
      .replace("http://localhost", "http://10.0.2.2");
  }
};

const supabaseUrl = getAndroidSafeUrl(resolvedSupabaseUrl);

export const supabase = createClient(supabaseUrl, baseSupabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
