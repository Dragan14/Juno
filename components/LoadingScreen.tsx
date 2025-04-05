import { Image } from "react-native";
import View from "@/components/ui/View";

export default function LoadingScreen() {
  console.log("Loading screen rendered");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("@/assets/images/icon.png")}
        style={{
          width: 200,
          height: 200,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
