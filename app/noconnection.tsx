import Text from "@/components/ui/Text";
import SafeAreaView from "@/components/ui/SafeAreaView";
import * as SplashScreen from "expo-splash-screen";

export default function NoConnectionScreen() {
  SplashScreen.hide();

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>No Internet Connection</Text>
    </SafeAreaView>
  );
}
