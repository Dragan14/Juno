import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useGetSession } from "../hooks/useSession";
import LoadingScreen from "../components/LoadingScreen";

export default function Index() {
  const router = useRouter();
  const { data: session, isLoading } = useGetSession();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (session) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/authentication");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, session, router]);

  return <LoadingScreen text="Loading app..." />;
}
