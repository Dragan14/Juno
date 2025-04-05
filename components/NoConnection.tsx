import { Text } from "react-native-paper";
import View from "@/components/ui/View";

export default function NoConnection() {
  // console.log("No connection screen rendered");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>No internet connection</Text>
    </View>
  );
}
