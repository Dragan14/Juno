import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "@/utils/supabase";

export function useAppStateRefresh() {
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        try {
          if (state === "active") {
            supabase.auth.startAutoRefresh();
          } else {
            supabase.auth.stopAutoRefresh();
          }
        } catch (error) {
          console.error("Error handling app state change:", error);
        }
      },
    );
    return () => {
      try {
        appStateSubscription.remove();
      } catch (error) {
        console.error("Error removing app state listener:", error);
      }
    };
  }, []);
}
