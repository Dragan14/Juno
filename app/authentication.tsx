import { useState } from "react";
import { useTheme, SegmentedButtons } from "react-native-paper";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

type AuthMode = "signIn" | "signUp";

SplashScreen.preventAutoHideAsync();

export default function Authentication() {
  const theme = useTheme();

  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

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
      {authMode === "signIn" ? <SignInForm /> : <SignUpForm />}
    </SafeAreaView>
  );
}
