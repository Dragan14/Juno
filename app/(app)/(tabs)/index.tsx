import { Text } from "react-native-paper";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import View from "@/components/ui/View";

export default function Home() {
  console.log("Home screen rendered");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text>This is the home page</Text>
      <Link href="/+not-found" asChild>
        <Button mode="contained">Go to the Not Found screen!</Button>
      </Link>
      <Link href="/(auth)/authentication" asChild>
        <Button mode="contained">Go to the Authentication screen!</Button>
      </Link>
    </View>
  );
}
