import { useEffect } from "react";
import { Platform } from "react-native";

const CHANNEL_NAME = "juno-tab-sync";

export function broadcastNewTabOpened() {
  if (Platform.OS !== "web" || typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage({ type: "new-tab-opened" });
  channel.close();
}

export function useTabSync() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof BroadcastChannel === "undefined")
      return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === "new-tab-opened") {
        window.close();
      }
    };

    return () => channel.close();
  }, []);
}
