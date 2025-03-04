import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

// Profile interface
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  updated_at: string | null;
}

// Query keys
const profileKeys = {
  profile: ["profile"],
};

// Hook for getting the user profile
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!userData.user) {
        return null;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (error) {
        throw error;
      }

      return data as Profile;
    },
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

      if (error) {
        throw error;
      }

      return data as Profile;
    },
    onSuccess: (data) => {
      // Update the profile query with the new data
      queryClient.setQueryData(profileKeys.profile, data);
    },
  });
};

// Hook to clear profile data (used during sign out)
export const useClearProfile = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.setQueryData(profileKeys.profile, null);
  };
};
