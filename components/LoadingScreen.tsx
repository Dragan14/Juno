import { View, Image } from "react-native";
import { useTheme } from "react-native-paper";

export default function LoadingScreen() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={{
          width: 200,
          height: 200,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
