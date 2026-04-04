import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useResetPassword } from "@/api/useAuth";
import { emailSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import TextInput from "@/components/ui/TextInput";
import { Mail } from "lucide-react-native";
import { useToast } from "@/context/ui/ToastContext";

export default function ForgotPasswordAlert({
  initialEmail,
  onClose,
}: {
  initialEmail: string;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const resetPassword = useResetPassword();
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSend = async () => {
    if (!validateEmail()) return;
    try {
      await resetPassword.mutateAsync(email);
      setCooldown(60);
      showToast({
        message:
          "Password reset email sent. You will receive an email if an account exists with that email exists.",
        variant: "success",
      });
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to send reset email. Please try again.",
        variant: "error",
      });
    }
  };

  const content = (
    <View style={{ gap: 16 }}>
      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
        Reset your password
      </Text>
      <Text style={{ textAlign: "center" }}>
        Enter your email and we&apos;ll send you a link to reset your password.
      </Text>
      <TextInput
        topLabel="Email"
        leftIcon={<Mail />}
        onChangeText={(val) => {
          setEmail(val);
          if (emailError) setEmailError("");
        }}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        error={!!emailError}
        errorMessage={emailError}
        retainErrorMessageSpace={true}
      />
      {cooldown > 0 && (
        <Text style={{ textAlign: "center" }}>
          Resend the reset password email in {cooldown} seconds.
        </Text>
      )}
      <Button
        onPress={handleSend}
        disabled={cooldown > 0 || resetPassword.isPending}
        loading={resetPassword.isPending}
      >
        Send Reset Password Email
      </Button>
      <Button onPress={onClose} variant="secondary" elevated>
        Cancel
      </Button>
    </View>
  );

  if (Platform.OS === "web") {
    return <form onSubmit={(e) => e.preventDefault()}>{content}</form>;
  }
  return content;
}
