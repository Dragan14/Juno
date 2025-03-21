import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { Profile } from "../types/profileTypes";
import { PROFILE_KEYS } from "../constants/queryKeys";
import { useGetUser } from "./useUser";
import { useToastStore } from "../stores/toastStore";

// Hook for getting the user profile
export const useGetProfile = () => {
  const { data: user } = useGetUser();
  const showToast = useToastStore((state) => state.showToast);

  return useQuery({
    queryKey: PROFILE_KEYS.profile,
    queryFn: async () => {
      // Return null if no user is logged in
      if (!user) {
        return null;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        showToast(error.message || "Failed to fetch profile");
        throw error;
      }
      return data as Profile;
    },
    // Only run the query if we have a user
    enabled: !!user,
    refetchOnWindowFocus: true,
  });
};

// Hook for updating the user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) {
        throw new Error("No user logged in");
      }
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      // Update the profile query with the new data
      queryClient.setQueryData(PROFILE_KEYS.profile, data);
    },
    onError: (error) => {
      showToast(error.message || "Failed to update profile");
    },
  });
};

// Hook to clear profile data (used during sign out)
export const useClearProfile = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.setQueryData(PROFILE_KEYS.profile, null);
  };
};
