import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { AUTH_KEYS } from "../constants/queryKeys";
import { getAuthCallbackUrl } from "../utils/urlUtils";
import { validateOtpCooldown } from "../utils/validateOtpCoolDown";
import type { SignInCredentials, SignUpCredentials } from "../types/authTypes";
import { useClearProfile } from "./useProfile";
import { useToastStore } from "../stores/toastStore";

// Hook for sign in functionality
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

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
    onError: (error) => {
      showToast(error.message || "Failed to sign in");
    },
  });
};

// Hook for sign up functionality
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

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
    onError: (error) => {
      showToast(error.message || "Failed to sign up");
    },
  });
};

// Hook for sign out functionality
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const clearProfile = useClearProfile();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.session, null);
      queryClient.setQueryData(AUTH_KEYS.user, null);
      clearProfile();
    },
    onError: (error) => {
      showToast(error.message || "Failed to sign out");
    },
  });
};
