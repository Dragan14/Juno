import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { AUTH_KEYS } from "../constants/queryKeys";
import { getAuthCallbackUrl } from "../constants/urlConstants";
import { validateOtpCooldown } from "../utils/auth";
import type {
  AuthEvent,
  SignInCredentials,
  SignUpCredentials,
} from "../types/authTypes";

// Hook for getting the current session
export const useSession = () => {
  return useQuery({
    queryKey: AUTH_KEYS.session,
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
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
  });
};

// Hook to get the current user
export const useUser = () => {
  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });
};

// Hook for sign in functionality
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: SignInCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
  });
};

// Hook for sign up functionality
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpCredentials) => {
      validateOtpCooldown();

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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: getAuthCallbackUrl(),
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.session) {
        queryClient.setQueryData(AUTH_KEYS.session, data.session);
        queryClient.setQueryData(AUTH_KEYS.user, data.user);
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
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.session, null);
      queryClient.setQueryData(AUTH_KEYS.user, null);
    },
  });
};

// Hook to listen for auth state changes from other tabs or external sources
export const useAuthStateChange = () => {
  const queryClient = useQueryClient();
  const [authEvent, setAuthEvent] = useState<AuthEvent>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "SIGNED_OUT":
          queryClient.setQueryData(AUTH_KEYS.session, null);
          queryClient.setQueryData(AUTH_KEYS.user, null);
          queryClient.clear();
          setAuthEvent({ type: event });
          break;

        case "USER_UPDATED":
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          setAuthEvent({ type: event, user: session?.user });
          break;

        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          queryClient.setQueryData(AUTH_KEYS.session, session);
          queryClient.setQueryData(AUTH_KEYS.user, session?.user || null);
          setAuthEvent({ type: event, session });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return { authEvent };
};
