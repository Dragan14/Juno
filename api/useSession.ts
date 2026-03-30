import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";

// Hook for getting the current session
export const useGetSession = () => {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Get session error:", error);
        throw error;
      }
      return data.session;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// Hook for setting the session with tokens
export const useSetSession = () => {
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
    retry: false,
    onError: (error) => {
      console.log("Set session error:", error);
    },
  });
};
