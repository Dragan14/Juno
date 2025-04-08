import { useState } from "react";
import { Keyboard } from "react-native";
import { useSignIn } from "@/api/useAuth";
import TextInput from "@/components/ui/TextInput";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { emailSchema } from "@/schemas/auth-schemas";
import { z } from "zod";

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
        label="Email"
        leftIcons={[<Icon name="mail" size={24} />]}
        onChangeText={setEmail}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        outlined={true}
        error={!!errors.email}
        errorMessage={errors.email}
      />
      <TextInput
        label="Password"
        leftIcons={[<Icon name="lock-closed" size={24} />]}
        rightIcons={[
          <Icon
            name={passwordVisible ? "eye" : "eye-off"}
            size={24}
            onPress={togglePasswordVisibility}
          />,
        ]}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        outlined={true}
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
