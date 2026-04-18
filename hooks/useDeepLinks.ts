import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSetSession } from "@/api/useSession";
import { useToast } from "@/context/ui/ToastContext";
import { AUTH_KEYS } from "@/constants/queryKeys";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { broadcastNewTabOpened } from "@/hooks/useTabSync";

export function useDeepLinks() {
  const setSession = useSetSession();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessingDeepLink, setIsProcessingDeepLink] = useState(false);

  const url = Linking.useLinkingURL();
  const lastProcessedUrl = useRef<string | null>(null);

  const createSessionFromUrl = useCallback(
    async (url: string) => {
      try {
        const { params } = QueryParams.getQueryParams(url);
        const { access_token, refresh_token, type } = params;
        if (access_token && refresh_token) {
          setIsProcessingDeepLink(true);
          broadcastNewTabOpened();
          console.log(
            "Setting access_token and refresh_token",
            access_token,
            refresh_token,
          );
          await setSession.mutateAsync({
            accessToken: access_token,
            refreshToken: refresh_token,
          });
          if (type === "recovery") {
            queryClient.setQueryData(AUTH_KEYS.isPasswordRecovery, true);
            console.log("Password recovery deep link detected");
          }
        }
      } catch (error) {
        console.log("Deep link error:", error);
        showToast({
          message: "Failed to authenticate from deep link",
          variant: "error",
        });
      } finally {
        setIsProcessingDeepLink(false);
        console.log("Finished processing deep link");
      }
    },
    [setSession, showToast, queryClient],
  );

  useEffect(() => {
    if (!url || lastProcessedUrl.current === url) return;
    lastProcessedUrl.current = url;

    try {
      console.log("Processing deep link URL:", url);
      createSessionFromUrl(url);
    } catch (error) {
      console.log("Unexpected error processing deep link:", error);
      showToast({
        message: "An error occurred while processing the link",
        variant: "error",
      });
    }
  }, [url, createSessionFromUrl, showToast]);

  return { isProcessingDeepLink };
}
