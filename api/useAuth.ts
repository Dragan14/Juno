import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS, PROFILE_KEYS } from "@/constants/queryKeys";
import { makeRedirectUri } from "expo-auth-session";
import type { SignInCredentials, SignUpCredentials } from "@/types/authTypes";

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
    retry: false,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
    onError: (error) => {
      console.log("Sign in error:", error);
      queryClient.setQueryData(AUTH_KEYS.session, null);
      queryClient.setQueryData(AUTH_KEYS.user, null);
      queryClient.setQueryData(PROFILE_KEYS.profile, null);
    },
  });
};

// Hook for sign up functionality
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpCredentials) => {
      const redirectUri = makeRedirectUri();
      console.log("Redirect URI for email verification:", redirectUri);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: redirectUri,
        },
      });
      if (error) throw error;
      if (!data.session && data?.user && data.user?.identities?.length === 0) {
        throw new Error("An account with this email already exists");
      }
      return data;
    },
    retry: false,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
    onError: (error) => {
      console.log("Sign up error:", error);
      queryClient.setQueryData(AUTH_KEYS.session, null);
      queryClient.setQueryData(AUTH_KEYS.user, null);
      queryClient.setQueryData(PROFILE_KEYS.profile, null);
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const redirectUri = makeRedirectUri();
      console.log("Redirect URI for email verification:", redirectUri);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: redirectUri,
        },
      });
      if (error) throw error;
    },
    retry: false,
    onError: (error) => {
      console.log("Resend verification email error:", error);
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
    retry: false,
    onError: (error) => {
      console.log("Sign out error:", error);
    },
    onSettled: () => {
      queryClient.setQueryData(AUTH_KEYS.session, null);
      queryClient.setQueryData(AUTH_KEYS.user, null);
      queryClient.setQueryData(PROFILE_KEYS.profile, null);
    },
  });
};
