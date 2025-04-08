import { View, StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeStore } from "@/stores/themeStore";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

interface EmailVerificationModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function EmailVerificationModal({
  visible,
  onDismiss,
}: EmailVerificationModalProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.container]}
        style={{ backgroundColor: theme.colors.background }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.message}>
            We sent you an email with a verification link.
          </Text>
          <Text style={styles.subMessage}>
            If you don't see the email, check your spam folder.
          </Text>
          <Button onPress={onDismiss} style={styles.button}>
            Got it
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 8,
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    marginBottom: 12,
    textAlign: "center",
  },
  subMessage: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  button: {
    width: "100%",
  },
});
