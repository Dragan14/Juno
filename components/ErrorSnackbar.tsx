import { Snackbar } from "react-native-paper";
import { useErrorStore } from "../stores/errorStore";

export function ErrorSnackbar() {
  const { message, visible, hideError } = useErrorStore();

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
