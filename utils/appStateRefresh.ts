import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "@/utils/supabase";

export function useAppStateRefresh() {
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          supabase.auth.startAutoRefresh();
        } else {
          supabase.auth.stopAutoRefresh();
        }
      },
    );
    return () => {
      appStateSubscription.remove();
    };
  }, []);
}
