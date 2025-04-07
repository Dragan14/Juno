import { useState } from "react";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { useThemeStore } from "@/stores/themeStore";
import View from "@/components/ui/View";
import SegmentedControl from "@/components/ui/SegmentedControl";

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
        <SegmentedControl
          values={["Sign In", "Sign Up"]}
          selectedIndex={authMode === "signIn" ? 0 : 1}
          onTabPress={(index) => setAuthMode(index === 0 ? "signIn" : "signUp")}
          tabsContainerStyle={{
            marginTop: 10,
            marginBottom: 25,
          }}
        />
        {authMode === "signIn" ? <SignInForm /> : <SignUpForm />}
      </View>
    </View>
  );
}
