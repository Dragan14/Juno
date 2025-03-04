import AppScreen from "../../components/AppScreen";
import Account from "../../components/Account";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <AppScreen
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <ScrollView>
        <Account />
      </ScrollView>
    </AppScreen>
  );
}
