import { Text } from "react-native-paper";
import { Link } from "expo-router";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function Home() {
  // console.log("Home screen rendered");

  return (
    <View isSafeArea>
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
        <Text
          style={{
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          This is the home page!
        </Text>
        <Link href="/+not-found" asChild>
          <Button
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          >
            Go to the Not Found screen!
          </Button>
        </Link>
        <Link href="/(auth)/authentication" asChild>
          <Button
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
          >
            Go to the Authentication screen!
          </Button>
        </Link>
        <Link href="https://dragan14.github.io" asChild>
          <Button
            variant="outlined"
            leftIcon={<Icon name="globe-outline" size={16} variant="active" />}
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
            textStyle={{ width: "70%" }}
          >
            Check out my portfolio!
          </Button>
        </Link>
        <Link href="https://github.com/dragan14" asChild>
          <Button
            variant="outlined"
            leftIcon={<Icon name="logo-github" size={16} variant="active" />}
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
            textStyle={{ width: "70%" }}
          >
            Check out my GitHub!
          </Button>
        </Link>
        <Link
          href="https://linkedin.com/in/dragan-stojanovski-5a1089228"
          asChild
        >
          <Button
            variant="outlined"
            leftIcon={<Icon name="logo-linkedin" size={16} variant="active" />}
            style={{ width: 300, marginHorizontal: "auto", marginBottom: 10 }}
            textStyle={{ width: "70%" }}
          >
            Check out my LinkedIn!
          </Button>
        </Link>
      </View>
    </View>
  );
}
