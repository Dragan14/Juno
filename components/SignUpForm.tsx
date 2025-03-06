import { useState, useCallback } from "react";
import { View, Keyboard } from "react-native";
import { emailSchema, passwordSchema } from "../schemas/validationSchemas";
import { useSignUp } from "../hooks/useAuth";
import { Button, TextInput, HelperText } from "react-native-paper";
import { z } from "zod";

interface SignUpFormProps {
  onSuccess: (message?: string) => void;
  onError: (message?: string) => void;
}

export default function SignUpForm({ onSuccess, onError }: SignUpFormProps) {
  const signUp = useSignUp();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Validate email input
  const validateEmail = useCallback(() => {
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
  }, [email]);

  // Validate password input
  const validatePassword = useCallback(() => {
    try {
      passwordSchema.parse(password);
      setErrors((prev) => ({ ...prev, password: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, password: error.errors[0].message }));
      }
      return false;
    }
  }, [password]);

  // Validate all inputs
  const validateForm = useCallback(() => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    return isEmailValid && isPasswordValid;
  }, [validateEmail, validatePassword]);

  // Handle sign up
  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      try {
        await signUp.mutateAsync({ email, password });
        onSuccess("Signed up successfully");
        // Reset form
        setEmail("");
        setPassword("");
        setErrors({ email: "", password: "" });
      } catch {
        onError("Failed to sign up");
      }
    }
  };

  return (
    <View>
      <TextInput
        label="Email"
        left={<TextInput.Icon icon="email" />}
        onChangeText={setEmail}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        error={!!errors.email}
        autoComplete="email"
      />
      {errors.email ? (
        <HelperText type="error">{errors.email}</HelperText>
      ) : null}
      <TextInput
        label="Password"
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye" : "eye-off"}
            onPress={togglePasswordVisibility}
          />
        }
        onChangeText={setPassword}
        onBlur={validatePassword}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        mode="outlined"
        error={!!errors.password}
        autoComplete="password"
      />
      {errors.password ? (
        <HelperText type="error">{errors.password}</HelperText>
      ) : null}
      <Button
        mode="contained"
        disabled={signUp.isPending}
        onPress={handleSignUp}
        loading={signUp.isPending}
      >
        Sign up
      </Button>
    </View>
  );
}
