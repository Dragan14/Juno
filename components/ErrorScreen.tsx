import { View } from "react-native";
import { useTheme, Button, Text } from "react-native-paper";

interface ErrorScreenProps {
  text?: string;
  onPress?: () => void;
}

export default function ErrorScreen({
  text = "Error Loading...",
  onPress = () => {},
}: ErrorScreenProps) {
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
      <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
        {text}
      </Text>
      <Button mode="contained" onPress={onPress}>
        Retry
      </Button>
    </View>
  );
}
