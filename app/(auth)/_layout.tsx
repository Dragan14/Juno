import { Stack } from "expo-router";
import { useGetSession } from "../../hooks/useSession";
import { useRouter } from "expo-router";

export default function AuthLayout() {
  const router = useRouter();

  const { data: session, isLoading } = useGetSession();

  if (isLoading) {
    return null;
  }

  // If already authenticated, redirect to home
  if (session) {
    router.replace("/(tabs)");
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Sign In / Sign Up",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
