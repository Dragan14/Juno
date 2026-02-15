import { useState } from "react";
import { useSignOut } from "@/api/useAuth";
import { useToast } from "@/context/ToastContext";
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
  console.log("Error screen rendered");
  const signOut = useSignOut();
  const { showToast } = useToast();
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
            try {
              await onPress();
            } catch (error) {
              console.error("Retry failed:", error);
              showToast({
                message: "Failed to retry. Please try again.",
                variant: "error",
              });
            } finally {
              setIsRetrying(false);
            }
          }}
          style={{ width: "75%" }}
          loading={isRetrying}
        >
          Retry
        </Button>
      )}
      <Button
        onPress={async () => {
          try {
            await signOut.mutateAsync();
          } catch (error) {
            console.error("Sign out failed:", error);
            showToast({
              message: "Failed to sign out. Please try again.",
              variant: "error",
            });
          }
        }}
        style={{ width: "75%" }}
      >
        Sign Out
      </Button>
    </View>
  );
}
