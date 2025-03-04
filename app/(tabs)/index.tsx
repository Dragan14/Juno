import Account from "../../components/Account";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <ScrollView>
        <Account />
      </ScrollView>
    </SafeAreaView>
  );
}
