import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useTheme, SegmentedButtons, Snackbar } from "react-native-paper";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";

type AuthMode = "signIn" | "signUp";

export default function Authentication() {
  // Theme
  const theme = useTheme();

  // Auth mode state
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

  // Snackbar state (shared between both forms)
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
        duration={3000}
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
