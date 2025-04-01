import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useGetSession } from "@/api/useSession";

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const session = useGetSession();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session.data &&
      !inAuthGroup &&
      !session.isLoading
    ) {
      console.log("Redirecting to auth page");
      // Redirect to the authentication page
      router.replace("/(auth)/authentication");
    } else if (session.data && inAuthGroup) {
      console.log("Redirecting to main app");
      // Redirect to the main app
      router.replace("/(app)/(tabs)");
    }
  }, [router, segments, session.data, session.isLoading]);
}
