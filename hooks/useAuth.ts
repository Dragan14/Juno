import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Query keys
const authKeys = {
  session: ["session"],
  user: ["user"],
};

// Helper to get the proper auth callback URL
const getAuthCallbackUrl = () => {
  const scheme = Constants.expoConfig?.extra?.scheme || "juno";

  if (Platform.OS === "web") {
    return `${window.location.origin}/auth-callback`;
  } else {
    return `${scheme}://auth-callback`;
  }
};

// Hook for getting the current session
export const useSession = () => {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session;
    },
    refetchOnWindowFocus: true,
  });
};

// Hook to get the current user
export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return data.user;
    },
  });
};

// Hook for sign in functionality
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Update the session and user queries with the new data
      queryClient.setQueryData(authKeys.session, data.session);
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
};

// Hook for sign up functionality
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: getAuthCallbackUrl(),
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.session) {
        queryClient.setQueryData(authKeys.session, data.session);
        queryClient.setQueryData(authKeys.user, data.user);
      } else {
        router.replace("/confirm-email");
      }
    },
  });
};

// Hook for sign out functionality
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return null;
    },
    onSuccess: () => {
      // Clear the session and user data from cache
      queryClient.setQueryData(authKeys.session, null);
      queryClient.setQueryData(authKeys.user, null);
    },
  });
};

// Hook to listen for auth state changes from other tabs or external sources
export const useAuthStateChange = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (["SIGNED_OUT"].includes(event)) {
        // Invalidate session and user data
        queryClient.setQueryData(authKeys.session, null);
        queryClient.setQueryData(authKeys.user, null);
      } else if ("USER_UPDATED" === event) {
        // Fetch and update user data
        queryClient.setQueryData(authKeys.user, session?.user || null);
      } else {
        // Fetch and update session data
        queryClient.setQueryData(authKeys.session, session);
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
