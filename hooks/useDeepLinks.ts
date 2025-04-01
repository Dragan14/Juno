import * as Linking from "expo-linking";
import { useEffect } from "react";
import { useSetSession } from "@/api/useSession";

export function useDeepLinks() {
  const setSession = useSetSession();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const hashIndex = url.indexOf("#");
      if (hashIndex !== -1) {
        const hashString = url.substring(hashIndex + 1);
        const params = new URLSearchParams(hashString);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          setSession.mutateAsync({ accessToken, refreshToken });
        }
      }
    };

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    });

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [setSession]);
}
