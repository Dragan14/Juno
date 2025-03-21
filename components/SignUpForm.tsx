import { useState, useCallback } from "react";
import { View, Keyboard } from "react-native";
import {
  emailSchema,
  passwordSchema,
  nameSchema,
} from "../schemas/auth-schemas";
import { useSignUp } from "../hooks/useAuth";
import { Button, TextInput, HelperText } from "react-native-paper";
import { z } from "zod";
import EmailVerificationModal from "./VerifyEmailModal";

export default function SignUpForm() {
  const signUp = useSignUp();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Email verification modal state
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);

  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Toggle password visibility
  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate name input
  const validateName = useCallback(() => {
    try {
      nameSchema.parse(name);
      setErrors((prev) => ({ ...prev, name: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, name: error.errors[0].message }));
      }
      return false;
    }
  }, [name]);

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

  // Validate confirm password input
  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  }, [confirmPassword, password]);

  // Validate all inputs
  const validateForm = useCallback(() => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return (
      isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid
    );
  }, [validateName, validateEmail, validatePassword, validateConfirmPassword]);

  // Handle sign up
  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      const { session } = await signUp.mutateAsync({ email, password, name });
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({ name: "", email: "", password: "", confirmPassword: "" });
      // Show verification modal if no session is returned
      if (!session) {
        setVerificationModalVisible(true);
      }
    }
  };

  return (
    <View>
      <TextInput
        label="Name"
        left={<TextInput.Icon icon="account" />}
        onChangeText={setName}
        onBlur={validateName}
        value={name}
        placeholder="Name"
        autoCapitalize="words"
        mode="outlined"
        error={!!errors.name}
        autoComplete="name"
      />
      {errors.name ? <HelperText type="error">{errors.name}</HelperText> : null}
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
            icon={passwordVisibility.password ? "eye" : "eye-off"}
            onPress={() => togglePasswordVisibility("password")}
          />
        }
        onChangeText={setPassword}
        onBlur={validatePassword}
        value={password}
        secureTextEntry={!passwordVisibility.password}
        placeholder="Password"
        autoCapitalize="none"
        mode="outlined"
        error={!!errors.password}
        autoComplete="password"
      />
      {errors.password ? (
        <HelperText type="error">{errors.password}</HelperText>
      ) : null}
      <TextInput
        label="Confirm Password"
        left={<TextInput.Icon icon="lock-check" />}
        right={
          <TextInput.Icon
            icon={passwordVisibility.confirmPassword ? "eye" : "eye-off"}
            onPress={() => togglePasswordVisibility("confirmPassword")}
          />
        }
        onChangeText={setConfirmPassword}
        onBlur={validateConfirmPassword}
        value={confirmPassword}
        secureTextEntry={!passwordVisibility.confirmPassword}
        placeholder="Confirm Password"
        autoCapitalize="none"
        mode="outlined"
        error={!!errors.confirmPassword}
        autoComplete="password"
      />
      {errors.confirmPassword ? (
        <HelperText type="error">{errors.confirmPassword}</HelperText>
      ) : null}
      <Button
        mode="contained"
        disabled={signUp.isPending}
        onPress={handleSignUp}
        loading={signUp.isPending}
      >
        Sign up
      </Button>

      <EmailVerificationModal
        visible={verificationModalVisible}
        onDismiss={() => setVerificationModalVisible(false)}
      />
    </View>
  );
}
