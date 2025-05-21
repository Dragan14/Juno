import { useState } from "react";
import { Keyboard } from "react-native";
import { useSignIn } from "@/api/useAuth";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { emailSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";

export default function SignInForm() {
  const signIn = useSignIn();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
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
      await signIn.mutateAsync({ email, password });
      // Reset form
      setEmail("");
      setPassword("");
      setErrors({ email: "" });
    }
  };

  return (
    <>
      <TextInput
        topLabel="Email"
        leftIcon={<Mail />}
        onChangeText={setEmail}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        error={!!errors.email}
        errorMessage={errors.email}
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
