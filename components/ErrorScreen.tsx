import { useState } from "react";
import { useSignOut } from "@/api/useAuth";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

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
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        maxWidth: 800,
        alignSelf: "center",
      }}
    >
      <Text style={{ marginTop: 16 }}>{text}</Text>
      {onPress && (
        <Button
          onPress={async () => {
            setIsRetrying(true);
            await onPress();
            setIsRetrying(false);
          }}
          style={{ width: "75%" }}
          loading={isRetrying}
        >
          Retry
        </Button>
      )}
      <Button
        onPress={async () => {
          await signOut.mutateAsync();
        }}
        style={{ width: "75%" }}
      >
        Sign Out
      </Button>
    </View>
  );
}
