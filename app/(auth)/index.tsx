import { useState } from "react";
import { Image } from "react-native";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import SafeAreaView from "@/components/ui/SafeAreaView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
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
          justifyContent: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 75,
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={require("@/assets/images/splash-icon.png")}
              style={{
                width: 60,
                height: 60,
                position: "absolute",
                left: -75,
                top: -10,
              }}
            />
            <SegmentedControl
              values={[
                <Text key="tab1">Sign In</Text>,
                <Text key="tab2">Sign Up</Text>,
              ]}
              selectedIndices={selectedIndices}
              onTabPress={(index) => {
                setSelectedIndices([index]);
              }}
              style={{
                minHeight: 40,
                width: 400,
              }}
            />
          </View>
        </View>
        <View style={{ display: selectedIndices[0] === 0 ? "flex" : "none" }}>
          <SignInForm />
        </View>
        <View style={{ display: selectedIndices[0] === 1 ? "flex" : "none" }}>
          <SignUpForm />
        </View>
      </View>
    </SafeAreaView>
  );
}
