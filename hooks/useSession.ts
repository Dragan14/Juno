import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { AUTH_KEYS } from "../constants/queryKeys";

// Hook for getting the current session
export const useGetSession = () => {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    retry: false,
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
    retry: false,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
  });
};
