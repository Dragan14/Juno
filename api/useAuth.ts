import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { getDeepLink } from "@/utils/deepLinkUtils";
import type { SignInCredentials, SignUpCredentials } from "@/types/authTypes";
import { useClearProfile } from "./useProfile";
import { useToastStore } from "@/stores/toastStore";

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
    retry: false,
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: getDeepLink(),
        },
      });
      if (error) throw error;
      return data;
    },
    retry: false,
    onSuccess: (data) => {
      if (data.session) {
        queryClient.setQueryData(AUTH_KEYS.session, data.session);
        queryClient.setQueryData(AUTH_KEYS.user, data.user);
      } else if (data?.user && data.user?.identities?.length === 0) {
        showToast("An account with this email already exists. Please sign in.");
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
    retry: false,
    onError: (error) => {
      showToast(error.message || "Failed to sign out");
    },
    onSettled: () => {
      queryClient.setQueryData(AUTH_KEYS.session, null);
      queryClient.setQueryData(AUTH_KEYS.user, null);
      clearProfile();
    },
  });
};
