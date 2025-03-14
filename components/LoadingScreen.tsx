import { View } from "react-native";
import { useTheme, ActivityIndicator, Text } from "react-native-paper";

interface LoadingScreenProps {
  text?: string;
}

export default function LoadingScreen({
  text = "Loading...",
}: LoadingScreenProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator animating={true} size="large" />
      <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
        {text}
      </Text>
    </View>
  );
}
