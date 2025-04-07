import { Text } from "react-native-paper";
import { Link } from "expo-router";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";

export default function Home() {
  // console.log("Home screen rendered");

  return (
    <View
      isSafeArea
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text>This is the home page</Text>
      <Link href="/+not-found" asChild>
        <Button>Go to the Not Found screen!</Button>
      </Link>
      <Link href="/(auth)/authentication" asChild>
        <Button>Go to the Authentication screen!</Button>
      </Link>
    </View>
  );
}
