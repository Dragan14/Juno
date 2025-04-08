import { Text } from "react-native-paper";
import { SafeAreaView } from "@/components/ui/SafeAreaView";

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
