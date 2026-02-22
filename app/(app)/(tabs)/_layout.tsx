import { Tabs, type ErrorBoundaryProps } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import ErrorScreen from "@/components/ErrorScreen";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <ErrorScreen
      text={error.message || "An unexpected error has occurred."}
      onPress={retry}
      signOutButton={true}
    />
  );
}

export default function TabsLayout() {
  console.log("Tabs layout rendered");

  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.onBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              allowIconScaling={false}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: true,
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              allowIconScaling={false}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="cog-outline"
              color={color}
              allowIconScaling={false}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
