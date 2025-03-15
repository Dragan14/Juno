import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { AUTH_KEYS } from "../constants/queryKeys";
import { router } from "expo-router";

// Hook to listen for auth state changes
export const useAuthStateChange = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event from subscription:", event, session);
      switch (event) {
        case "SIGNED_OUT":
          queryClient.setQueryData(AUTH_KEYS.session, null);
          queryClient.setQueryData(AUTH_KEYS.user, null);
          queryClient.clear();
          router.replace("/(auth)/authentication");
          break;
        case "USER_UPDATED":
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          break;
        case "SIGNED_IN":
          queryClient.setQueryData(AUTH_KEYS.session, session);
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          router.replace("/(tabs)");
          break;
        case "TOKEN_REFRESHED":
          queryClient.setQueryData(AUTH_KEYS.session, session);
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          break;
      }
    });
    return () => {
      console.log("Unsubscribing from auth state change");
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
