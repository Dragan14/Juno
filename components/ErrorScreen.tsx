import { useState } from "react";
import { Text } from "react-native-paper";
import { useSignOut } from "@/api/useAuth";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";

interface ErrorScreenProps {
  text?: string;
  onPress?: () => Promise<any>;
}

export default function ErrorScreen({
  text = "Error Loading...",
  onPress = async () => {},
}: ErrorScreenProps) {
  // console.log("Error screen rendered");
  const signOut = useSignOut();
  const [isRetrying, setIsRetrying] = useState(false);

  return (
    <View
      isSafeArea
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ marginTop: 16 }}>{text}</Text>
      <Button
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
