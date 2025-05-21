import SafeAreaView from "@/components/ui/SafeAreaView";
import * as SplashScreen from "expo-splash-screen";
import ErrorScreen from "@/components/ErrorScreen";

export default function Error() {
  SplashScreen.hide();

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ErrorScreen text="Error" />
    </SafeAreaView>
  );
}
