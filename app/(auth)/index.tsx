import { useState } from "react";
import { Text } from "react-native";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import SafeAreaView from "@/components/ui/SafeAreaView";
import View from "@/components/ui/View";
import SegmentedControl from "@/components/ui/SegmentedControl";

export default function AuthenticationScreen() {
  console.log("Authentication screen rendered");

  const [selectedIndices, setSelectedIndices] = useState<number[]>([0]);

  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 800,
          paddingHorizontal: 10,
          marginHorizontal: "auto",
          marginTop: 10,
        }}
      >
        <SegmentedControl
          values={[
            <Text key="tab1">Sign In</Text>,
            <Text key="tab2">Sign Up</Text>,
          ]}
          selectedIndices={selectedIndices}
          onTabPress={(index) => {
            setSelectedIndices([index]);
          }}
          style={{ marginBottom: 20, minHeight: 40 }}
        />
        <SignInForm style={{ display: selectedIndices[0] === 0 ? "flex" : "none" }} />
        <SignUpForm style={{ display: selectedIndices[0] === 1 ? "flex" : "none" }} />
      </View>
    </SafeAreaView>
  );
}
