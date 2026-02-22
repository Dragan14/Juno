import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Profile } from "@/types/profileTypes";
import { PROFILE_KEYS } from "@/constants/queryKeys";

// Hook for getting the user profile
export const useGetProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.profile,
    queryFn: async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.log("Get user error:", userError);
        throw userError;
      }
      if (!userData.user) {
        throw new Error("No user logged in");
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();
      if (error) {
        console.log("Get profile error:", error);
        throw error;
      }
      return data as Profile;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// Hook for updating the user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.log("Get user error:", userError);
        throw userError;
      }
      if (!userData.user) {
        throw new Error("No user logged in");
      }
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userData.user.id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    retry: false,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEYS.profile, data);
    },
    onError: (error) => {
      console.log("Update profile error:", error);
    },
  });
};
