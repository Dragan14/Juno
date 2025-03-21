import { Snackbar } from "react-native-paper";
import { useToastStore } from "../stores/toastStore";

export function ErrorSnackbar() {
  const { message, visible, hideError } = useToastStore();

  return (
    <Snackbar
      visible={visible}
      onDismiss={hideError}
      duration={7000}
      action={{
        label: "Close",
        onPress: hideError,
      }}
    >
      {message}
    </Snackbar>
  );
}
