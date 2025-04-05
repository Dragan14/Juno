import { useState } from "react";
import { Button, Text } from "react-native-paper";
import { useSignOut } from "@/api/useAuth";
import { useThemeStore } from "@/stores/themeStore";
import View from "@/components/ui/View";

interface ErrorScreenProps {
  text?: string;
  onPress?: () => Promise<any>;
}

export default function ErrorScreen({
  text = "Error Loading...",
  onPress = async () => {},
}: ErrorScreenProps) {
  console.log("Error screen rendered");
  const theme = useThemeStore((state) => state.theme);
  const signOut = useSignOut();
  const [isRetrying, setIsRetrying] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ marginTop: 16 }}>{text}</Text>
      <Button
        mode="contained"
        onPress={async () => {
          setIsRetrying(true);
          await onPress();
          setIsRetrying(false);
        }}
        disabled={signOut.isPending}
      >
        Retry
      </Button>
      <Button
        disabled={isRetrying}
        loading={signOut.isPending}
        onPress={async () => {
          await signOut.mutateAsync();
        }}
      >
        Sign Out
      </Button>
    </View>
  );
}
