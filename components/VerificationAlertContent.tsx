import { useState, useEffect } from "react";
import { useResendVerificationEmail } from "@/api/useAuth";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useToast } from "@/context/ui/ToastContext";

export default function VerificationAlertContent({
  email,
  onClose,
  initialCooldown = 60,
}: {
  email: string;
  onClose: () => void;
  initialCooldown?: number;
}) {
  const { showToast } = useToast();
  const resendVerificationEmail = useResendVerificationEmail();
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    try {
      await resendVerificationEmail.mutateAsync(email);
      showToast({
        message: "Verification email resent. Please check your inbox.",
        variant: "success",
      });
      setCooldown(60);
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to resend verification email. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <View style={{ gap: 20 }}>
      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
        Check your Email for a verification link
      </Text>
      <Button onPress={onClose} variant="primary" outlined={true}>
        Ok
      </Button>
      {cooldown > 0 && (
        <Text style={{ textAlign: "center" }}>
          Resend the verification email in {cooldown} seconds.
        </Text>
      )}
      <Button
        onPress={handleResend}
        variant="primary"
        disabled={cooldown > 0 || resendVerificationEmail.isPending}
        loading={resendVerificationEmail.isPending}
      >
        Resend Verification Email
      </Button>
    </View>
  );
}
