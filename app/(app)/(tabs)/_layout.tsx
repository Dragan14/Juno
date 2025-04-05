import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useThemeStore } from "@/stores/themeStore";

export default function TabsLayout() {
  // console.log("Tabs layout rendered");
  const theme = useThemeStore((state) => state.theme);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "home" : "home-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "account" : "account-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tabs>
  );
}
