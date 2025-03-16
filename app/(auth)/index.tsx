import { useState } from "react";
import { View } from "react-native";
import { useTheme, Snackbar } from "react-native-paper";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import SignInForm from "../../components/SignInForm";
import SignUpForm from "../../components/SignUpForm";

type AuthMode = "signIn" | "signUp";

export default function Authentication() {
  const theme = useTheme();

  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

  const handleChange = (event: {
    nativeEvent: { selectedSegmentIndex: number };
  }) => {
    setAuthMode(
      event.nativeEvent.selectedSegmentIndex === 0 ? "signIn" : "signUp",
    );
  };

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
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <SegmentedControl
        values={["Sign In", "Sign Up"]}
        selectedIndex={authMode === "signIn" ? 0 : 1}
        onChange={handleChange}
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
    </View>
  );
}
