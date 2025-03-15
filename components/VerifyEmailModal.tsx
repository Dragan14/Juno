import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, Button, useTheme } from "react-native-paper";

interface EmailVerificationModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function EmailVerificationModal({
  visible,
  onDismiss,
}: EmailVerificationModalProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Check your email
          </Text>
          <Text variant="bodyLarge" style={styles.message}>
            We've sent you an email with a verification link.
          </Text>
          <Text variant="bodyMedium" style={styles.subMessage}>
            If you don't see the email, check your spam folder.
          </Text>
          <Button mode="contained" onPress={onDismiss} style={styles.button}>
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
