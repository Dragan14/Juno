import { SafeAreaView } from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";

export default function NoConnection() {
  // console.log("No connection screen rendered");

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>No internet connection</Text>
    </SafeAreaView>
  );
}
