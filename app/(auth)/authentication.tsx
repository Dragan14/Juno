import { useState } from "react";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import View from "@/components/ui/View";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { SafeAreaView } from "@/components/ui/SafeAreaView";

type AuthMode = "signIn" | "signUp";

export default function Authentication() {
  // console.log("Authentication screen rendered");

  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 800,
          paddingHorizontal: 10,
          marginHorizontal: "auto",
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
    </SafeAreaView>
  );
}
