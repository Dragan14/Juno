import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { router } from "expo-router";

// Hook to listen for auth state changes and update the query cache accordingly and redirect the user
export const useAuthStateChange = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
        case "INITIAL_SESSION":
          queryClient.setQueryData(AUTH_KEYS.session, session);
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          router.replace("/(app)/(tabs)");
          break;
        case "TOKEN_REFRESHED":
          queryClient.setQueryData(AUTH_KEYS.session, session);
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
