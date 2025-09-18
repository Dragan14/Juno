import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";

// Hook to get the current user
export const useGetUser = () => {
  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Get user error:", error);
        throw error;
      }
      return data.user;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });
};
