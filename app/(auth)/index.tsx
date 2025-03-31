import { useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { useThemeStore } from "@/stores/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthMode = "signIn" | "signUp";

export default function Authentication() {
  const theme = useThemeStore((state) => state.theme);

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
