import { Tabs } from "expo-router";
import { useTheme, Icon } from "react-native-paper";
import { useGetSession } from "../../hooks/useSession";
import { useRouter } from "expo-router";

export default function TabsLayout() {
  const theme = useTheme();
  const router = useRouter();
  const { data: session, isLoading } = useGetSession();

  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to authentication screen
  if (!session) {
    router.replace("/authentication");
    return null;
  }

  return (
    <Tabs
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
        headerTintColor: theme.colors.onSurface,
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
