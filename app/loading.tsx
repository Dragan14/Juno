import SafeAreaView from "@/components/ui/SafeAreaView";
import * as SplashScreen from "expo-splash-screen";
import Loading from "@/components/Loading";

export default function Error() {
  SplashScreen.hide();

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loading />
    </SafeAreaView>
  );
}
