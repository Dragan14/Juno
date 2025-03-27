import { Snackbar } from "react-native-paper";
import { useToastStore } from "@/stores/toastStore";

export function Toast() {
  const { message, visible, hideToast } = useToastStore();

  return (
    <Snackbar
      visible={visible}
      onDismiss={hideToast}
      duration={7000}
      action={{
        label: "Close",
        onPress: hideToast,
      }}
    >
      {message}
    </Snackbar>
  );
}
