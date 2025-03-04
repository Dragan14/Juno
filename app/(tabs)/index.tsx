import AppScreen from "../../components/AppScreen";
import Account from "../../components/Account";

export default function Index() {
  return (
    <AppScreen
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Account />
    </AppScreen>
  );
}
