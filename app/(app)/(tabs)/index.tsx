import SafeAreaView from "@/components/ui/SafeAreaView";
import View from "@/components/ui/View";
import { Link } from "expo-router";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/context/ToastContext";

export default function HomeScreen() {
  console.log("Home screen rendered");
  const { showToast } = useToast();

  return (
    <SafeAreaView disableBottomSafeArea>
      <View
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          paddingHorizontal: 10,
          marginHorizontal: "auto",
          justifyContent: "center",
        }}
      >
        <Button
          leftIcon={<Ionicons name="notifications-outline" />}
          style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          onPress={() =>
            showToast({ message: "An account with that email already exists!" })
          }
        >
          Show Test Toast
        </Button>
        <Link href="/+not-found" asChild>
          <Button
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          >
            Go to the Not Found screen!
          </Button>
        </Link>
        <Link href="/(auth)" asChild>
          <Button
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 20 }}
          >
            Go to the Authentication screen!
          </Button>
        </Link>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontSize: 24,
          }}
        >
          This is the home page!
        </Text>
        <Link href="https://dragan14.github.io" asChild>
          <Button
            leftIcon={<Ionicons name="globe-outline" />}
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          >
            Check out my portfolio!
          </Button>
        </Link>
        <Link href="https://github.com/dragan14" asChild>
          <Button
            leftIcon={<Ionicons name="logo-github" />}
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          >
            Check out my GitHub!
          </Button>
        </Link>
        <Link
          href="https://linkedin.com/in/dragan-stojanovski-5a1089228"
          asChild
        >
          <Button
            leftIcon={<Ionicons name="logo-linkedin" />}
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          >
            Checkout my LinkedIn!
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
