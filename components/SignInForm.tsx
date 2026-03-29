import { useState } from "react";
import { Keyboard } from "react-native";
import { useSignIn } from "@/api/useAuth";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { emailSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useAlert } from "@/context/ui/AlertContext";
import { useToast } from "@/context/ui/ToastContext";
import VerificationAlertContent from "@/components/VerificationAlertContent";

export default function SignInForm() {
  const { showAlert, hideAlert } = useAlert();
  const { showToast } = useToast();
  const signIn = useSignIn();

  // Form state
  const [email, setEmail] = useState(process.env.EXPO_PUBLIC_DEMO_EMAIL!);
  const [password, setPassword] = useState("Password123!");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });
  const [touched, setTouched] = useState({
    email: false,
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Validate email input
  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, email: error.errors[0].message }));
      }
      return false;
    }
  };

  // Handle sign in
  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (validateEmail()) {
      const submittedEmail = email;
      try {
        await signIn.mutateAsync({ email, password });
        // Reset form
        setEmail("");
        setPassword("");
        setErrors({ email: "" });
        setTouched({ email: false });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          showAlert({
            content: (
              <VerificationAlertContent
                email={submittedEmail}
                onClose={hideAlert}
                initialCooldown={0}
              />
            ),
          });
        } else {
          showToast({
            message:
              error instanceof Error
                ? error.message
                : "Failed to sign in. Please try again.",
            variant: "error",
          });
        }
      }
    }
  };

  return (
    <>
      <TextInput
        topLabel="Email"
        leftIcon={<Mail />}
        onChangeText={(val) => {
          setTouched((prev) => ({ ...prev, email: true }));
          setEmail(val);
        }}
        onBlur={() => touched.email && validateEmail()}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        error={!!errors.email}
        errorMessage={errors.email}
        retainErrorMessageSpace={true}
      />
      <TextInput
        topLabel="Password"
        leftIcon={<Lock />}
        rightIcon={
          passwordVisible ? (
            <Eye onPress={togglePasswordVisibility} />
          ) : (
            <EyeOff onPress={togglePasswordVisibility} />
          )
        }
        onChangeText={setPassword}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
      />
      <Button
        disabled={signIn.isPending}
        onPress={handleSignIn}
        loading={signIn.isPending}
      >
        Sign In
      </Button>
    </>
  );
}
