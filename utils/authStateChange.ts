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
      try {
        console.log("Auth state change event:", event);
        switch (event) {
          case "SIGNED_OUT":
            queryClient.setQueryData(AUTH_KEYS.session, null);
            queryClient.setQueryData(AUTH_KEYS.user, null);
            queryClient.clear();
            console.log("User signed out");
            break;
          case "USER_UPDATED":
            queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
            console.log("User updated:", session?.user);
            break;
          case "INITIAL_SESSION":
          case "SIGNED_IN":
            queryClient.setQueryData(AUTH_KEYS.session, session);
            queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
            console.log("User signed in or initial session:", session);
            break;
          case "TOKEN_REFRESHED":
            queryClient.setQueryData(AUTH_KEYS.session, session);
            queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
            console.log("Token refreshed:", session);
            break;
        }
      } catch (error) {
        console.log("Error handling auth state change:", error);
      }
    });
    return () => {
      try {
        subscription.unsubscribe();
        console.log("Unsubscribed from auth state changes");
      } catch (error) {
        console.log("Error unsubscribing from auth state changes:", error);
      }
    };
  }, [queryClient]);
};
