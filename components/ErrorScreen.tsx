import { useState } from "react";
import { View } from "react-native";
import { useTheme, Button, Text } from "react-native-paper";
import { useSignOut } from "@/hooks/useAuth";

interface ErrorScreenProps {
  text?: string;
  onPress?: () => Promise<any>;
}

export default function ErrorScreen({
  text = "Error Loading...",
  onPress = async () => {},
}: ErrorScreenProps) {
  const theme = useTheme();
  const signOut = useSignOut();
  const [isRetrying, setIsRetrying] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
        {text}
      </Text>
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
