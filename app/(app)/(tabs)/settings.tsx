import SafeAreaView from "@/components/ui/SafeAreaView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import RadioButton from "@/components/ui/RadioButton";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  console.log("Settings screen rendered");

  const { themeMode, setThemeMode } = useTheme();

  return (
    <SafeAreaView
      disableTopSafeArea
      disableBottomSafeArea
      style={{ alignItems: "center" }}
    >
      <View
        style={{
          gap: 10,
          paddingLeft: 10,
          marginBottom: 10,
          marginTop: 10,
          maxWidth: 500,
        }}
      >
        <Text
          style={{ fontWeight: "bold", marginBottom: 5, textAlign: "center" }}
        >
          Select Theme:
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 75,
          }}
        >
          <RadioButton
            label="Light"
            value={themeMode === "light"}
            onValueChange={() => setThemeMode("light")}
          />
          <RadioButton
            label="Dark"
            value={themeMode === "dark"}
            onValueChange={() => setThemeMode("dark")}
          />
          <RadioButton
            label="System"
            value={themeMode === "system"}
            onValueChange={() => setThemeMode("system")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
