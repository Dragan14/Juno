import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { useToastStore } from "@/stores/toastStore";

// Hook to get the current user
export const useGetUser = () => {
  const showToast = useToastStore((state) => state.showToast);

  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        showToast(error.message || "Failed to fetch user");
        throw error;
      }
      return data.user;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });
};
