import { useState } from "react";
import { useSignOut } from "@/api/useAuth";
import { useToast } from "@/context/ToastContext";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

interface ErrorProps {
  text?: string;
  onPress?: () => Promise<any>;
  signOutButton?: boolean;
}

export default function Error({
  text = "Error Loading...",
  onPress = async () => {},
  signOutButton = true,
}: ErrorProps) {
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
              console.log("Retry failed:", error);
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
      {signOutButton && (
        <Button
          onPress={async () => {
            try {
              await signOut.mutateAsync();
            } catch (error) {
              console.log("Sign out failed:", error);
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
      )}
    </View>
  );
}
