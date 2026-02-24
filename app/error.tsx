import SafeAreaView from "@/components/ui/SafeAreaView";
import * as SplashScreen from "expo-splash-screen";
import Error from "@/components/Error";

export default function ErrorScreen() {
  SplashScreen.hide();

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Error text="Error" />
    </SafeAreaView>
  );
}
