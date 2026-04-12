import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS, PROFILE_KEYS } from "@/constants/queryKeys";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import type { SignInCredentials, SignUpCredentials } from "@/types/authTypes";
import {
  GoogleSignin,
  isCancelledResponse,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

const generateRawNonce = () => {
  const bytes = Crypto.getRandomBytes(32);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

const sha256 = async (value: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);

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
      queryClient.clear();
    },
  });
};

// Hook for sign up functionality
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpCredentials) => {
      const redirectUri = makeRedirectUri() + "/account";
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
      queryClient.clear();
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const redirectUri = makeRedirectUri() + "/account";
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

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const redirectUri = makeRedirectUri() + "/reset-password";
      console.log("Redirect URI for password reset:", redirectUri);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUri,
      });
      if (error) throw error;
      return data;
    },
    retry: false,
    onError: (error) => {
      console.log("Reset password error:", error);
    },
  });
};

export const useIsPasswordRecovery = () => {
  const { data } = useQuery({
    queryKey: AUTH_KEYS.isPasswordRecovery,
    queryFn: () => false,
    staleTime: Infinity,
  });
  return !!data;
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return data;
    },
    retry: false,
    onSuccess: () => {
      setTimeout(() => {
        console.log("Password updated, resetting password recovery state");
        queryClient.setQueryData(AUTH_KEYS.isPasswordRecovery, false);
      }, 2000);
    },
    onError: (error) => {
      console.log("Update password error:", error);
    },
  });
};

// Hook for Google Sign-In
export const useGoogleSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (Platform.OS === "web") {
        const redirectUri = makeRedirectUri();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUri,
          },
        });
        if (error) throw error;
        return null;
      }

      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ["profile", "email"],
      });
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isCancelledResponse(response)) {
        console.log("Google sign in cancelled by user");
        return;
      }
      const idToken = response.data?.idToken;
      if (!idToken) throw new Error("No ID token received from Google");
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) throw error;
      return data;
    },
    retry: false,
    onSuccess: (data) => {
      if (!data?.session) return;
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
    onError: (error: any) => {
      console.log("Google sign in error:", error);
    },
  });
};

// Hook for Apple Sign-In (iOS only)
export const useAppleSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const rawNonce = generateRawNonce();
      const hashedNonce = await sha256(rawNonce);
      let credential: AppleAuthentication.AppleAuthenticationCredential;
      try {
        credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
          nonce: hashedNonce,
        });
      } catch (error: any) {
        if (error?.code === "ERR_REQUEST_CANCELED") return;
        throw error;
      }
      if (!credential.identityToken)
        throw new Error("No identity token received from Apple");
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
        nonce: rawNonce,
      });
      if (error) throw error;
      return data;
    },
    retry: false,
    onSuccess: (data) => {
      if (!data?.session) return;
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
    onError: (error: any) => {
      console.log("Apple sign in error:", error);
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
      queryClient.clear();
    },
  });
};
