import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";

// Hook to listen for auth state changes and update the query cache accordingly and redirect the user
export const useAuthStateChange = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      switch (event) {
        case "SIGNED_OUT":
          queryClient.setQueryData(AUTH_KEYS.session, null);
          queryClient.setQueryData(AUTH_KEYS.user, null);
          queryClient.clear();
          break;
        case "USER_UPDATED":
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          break;
        case "INITIAL_SESSION":
        case "SIGNED_IN":
          queryClient.setQueryData(AUTH_KEYS.session, session);
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
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
