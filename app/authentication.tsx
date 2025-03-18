import { useState, useEffect } from "react";
import { useTheme, SegmentedButtons, Snackbar } from "react-native-paper";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useGetSession } from "../hooks/useSession";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthMode = "signIn" | "signUp";

export default function Authentication() {
  const theme = useTheme();

  const router = useRouter();

  const { data: session, isLoading } = useGetSession();

  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

  // Snackbar state (shared between both forms)
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/(app)/(tabs)");
    }
  }, [session, isLoading, router]);

  // Handle successful authentication
  const handleAuthSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handle authentication error
  const handleAuthError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <SegmentedButtons
        value={authMode}
        onValueChange={(value) => setAuthMode(value as AuthMode)}
        buttons={[
          { value: "signIn", label: "Sign In" },
          { value: "signUp", label: "Sign Up" },
        ]}
      />
      {authMode === "signIn" ? (
        <SignInForm
          onSuccess={(message) =>
            handleAuthSuccess(message || "Signed in successfully")
          }
          onError={(message) => handleAuthError(message || "Failed to sign in")}
        />
      ) : (
        <SignUpForm
          onSuccess={(message) =>
            handleAuthSuccess(message || "Signed up successfully")
          }
          onError={(message) => handleAuthError(message || "Failed to sign up")}
        />
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}
