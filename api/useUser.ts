import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { useToast } from "../context/ToastContext";

// Hook to get the current user
export const useGetUser = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        showToast({
          message: error.message || "Failed to fetch user",
          variant: "error",
        });
        throw error;
      }
      return data.user;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });
};
