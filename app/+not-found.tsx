import { Link } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import LoadingScreen from "@/components/LoadingScreen";
import { Platform } from "react-native";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { SafeAreaView } from "@/components/ui/SafeAreaView";
import MyView from "@/components/ui/View";

export default function NotFoundScreen() {
  // console.log("Not Found screen rendered");
  const [isWebLoading, setIsWebLoading] = useState(Platform.OS === "web");

  useEffect(() => {
    setTimeout(() => {
      setIsWebLoading(false);
      SplashScreen.hideAsync();
    }, 1500);
  }, []);

  if (isWebLoading) {
    return <LoadingScreen />;
  }

  return (
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
            Go back to Home screen!
          </Button>
        </Link>
      </MyView>
    </SafeAreaView>
  );
}
