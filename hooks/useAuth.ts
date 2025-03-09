import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
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

// Hook for setting the session with tokens
export const useSetSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    }) => {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
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
      // Check if user with this email already exists
      // If user exists, sign in with OTP
      const { error: checkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: getAuthCallbackUrl(),
        },
      });
      // If no error was returned it means the user exists
      if (!checkError) {
        throw new Error(
          "User with this email already exists. Please check your email to sign in.",
        );
      }
      // Proceed with sign up if user doesn't exist
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
// Define the type for auth events
type AuthEvent = {
  type: string;
  user?: any;
  session?: any;
} | null;

export const useAuthStateChange = () => {
  const queryClient = useQueryClient();
  const [authEvent, setAuthEvent] = useState<AuthEvent>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (["SIGNED_OUT"].includes(event)) {
        // Invalidate session and user data
        queryClient.setQueryData(authKeys.session, null);
        queryClient.setQueryData(authKeys.user, null);
        // Clear all queries to prevent stale data
        queryClient.clear();
        // Emit the auth event
        setAuthEvent({ type: event });
      } else if ("USER_UPDATED" === event) {
        // Fetch and update user data
        queryClient.setQueryData(authKeys.user, session?.user || null);
        setAuthEvent({ type: event, user: session?.user });
      } else if (["SIGNED_IN", "TOKEN_REFRESHED"].includes(event)) {
        // Fetch and update session data
        queryClient.setQueryData(authKeys.session, session);
        queryClient.setQueryData(authKeys.user, session?.user || null);
        setAuthEvent({ type: event, session });
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return { authEvent };
};
