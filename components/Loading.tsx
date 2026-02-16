import { Image } from "react-native";
import View from "@/components/ui/View";

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("@/assets/images/splash-icon.png")}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
    </View>
  );
}
