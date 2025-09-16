import { useEffect, useRef, useCallback } from "react";
import { useSetSession } from "@/api/useSession";
import { useToast } from "@/context/ToastContext";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";

export function useDeepLinks() {
  const setSession = useSetSession();
  const { showToast } = useToast();

  const url = Linking.useLinkingURL();
  const lastProcessedUrl = useRef<string | null>(null);

  const createSessionFromUrl = useCallback(
    async (url: string) => {
      try {
        const { params } = QueryParams.getQueryParams(url);
        const { access_token, refresh_token } = params;
        if (access_token && refresh_token) {
          console.log(
            "Setting access_token and refresh_token",
            access_token,
            refresh_token,
          );
          await setSession.mutateAsync({
            accessToken: access_token,
            refreshToken: refresh_token,
          });
        }
      } catch {
        showToast({
          message: "Failed to authenticate from deep link",
          variant: "error",
        });
      }
    },
    [setSession, showToast],
  );

  useEffect(() => {
    if (!url || lastProcessedUrl.current === url) return;
    lastProcessedUrl.current = url;
    createSessionFromUrl(url);
  }, [url, createSessionFromUrl]);
}
