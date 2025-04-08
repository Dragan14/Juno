import { Tabs } from "expo-router";
import { useThemeStore } from "@/stores/themeStore";
import Icon from "@/components/ui/Icon";

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
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: theme.colors.primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: true,
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "person" : "person-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
