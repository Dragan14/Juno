import { useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { useThemeStore } from "@/stores/themeStore";
import View from "@/components/ui/View";

type AuthMode = "signIn" | "signUp";

export default function Authentication() {
  // console.log("Authentication screen rendered");
  const theme = useThemeStore((state) => state.theme);

  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

  return (
    <View
      isSafeArea
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 650,
          alignSelf: "center",
          paddingHorizontal: 10,
        }}
      >
        <SegmentedButtons
          value={authMode}
          onValueChange={(value) => setAuthMode(value as AuthMode)}
          buttons={[
            { value: "signIn", label: "Sign In" },
            { value: "signUp", label: "Sign Up" },
          ]}
          style={{
            marginTop: 10,
            marginBottom: 15,
          }}
        />
        {authMode === "signIn" ? <SignInForm /> : <SignUpForm />}
      </View>
    </View>
  );
}
