import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function ConfirmEmail() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View>
        <Text variant="headlineMedium">Check your email</Text>
        <Text variant="bodyLarge">
          We've sent you an email with a verification link. Please check your
          inbox and click the link to verify your account.
        </Text>
        <Text variant="bodyMedium">
          If you don't see the email, check your spam folder.
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace("/authentication")}
        >
          Back to Sign In
        </Button>
      </View>
    </View>
  );
}
