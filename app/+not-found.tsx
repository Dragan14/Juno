import { Stack, Link } from "expo-router";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import MyView from "@/components/ui/View";
import * as SplashScreen from "expo-splash-screen";

export default function NotFoundScreen() {
  console.log("Not Found screen rendered");
  SplashScreen.hide();

  return (
    <>
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      <SafeAreaView>
        <MyView
          style={{
            flex: 1,
            maxWidth: 800,
            width: "100%",
            paddingHorizontal: 10,
            marginHorizontal: "auto",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Oops! This page does not exist.
          </Text>
          <Link href="/" asChild>
            <Button
              style={{
                width: 300,
                marginHorizontal: "auto",
              }}
            >
              Go back to the Home screen!
            </Button>
          </Link>
        </MyView>
      </SafeAreaView>
    </>
  );
}
