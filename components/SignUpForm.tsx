import { useState } from "react";
import { Keyboard } from "react-native";
import {
  emailSchema,
  passwordSchema,
  nameSchema,
} from "@/schemas/auth-schemas";
import { useSignUp } from "@/api/useAuth";
import { z } from "zod";
import EmailVerificationModal from "./VerifyEmailModal";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";

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
  const validateName = () => {
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

  // Validate password input
  const validatePassword = () => {
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
  };

  // Validate confirm password input
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  // Validate all inputs
  const validateForm = () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return (
      isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid
    );
  };

  // Handle sign up
  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      const { session, user } = await signUp.mutateAsync({
        email,
        password,
        name,
      });
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({ name: "", email: "", password: "", confirmPassword: "" });
      if (!session && !(user && user?.identities?.length === 0)) {
        setVerificationModalVisible(true);
      }
    }
  };

  return (
    <>
      <TextInput
        label="Name"
        leftIcon={{ name: "person" }}
        onChangeText={setName}
        onBlur={validateName}
        value={name}
        placeholder="Name"
        autoCapitalize="words"
        error={!!errors.name}
        errorMessage={errors.name}
        autoComplete="name"
      />
      <TextInput
        label="Email"
        leftIcon={{ name: "mail" }}
        onChangeText={setEmail}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        error={!!errors.email}
        errorMessage={errors.email}
        autoComplete="email"
      />
      <TextInput
        label="Password"
        leftIcon={{ name: "lock-closed" }}
        rightIcon={
          passwordVisibility.password
            ? {
                name: "eye",
                onPress: () => togglePasswordVisibility("password"),
              }
            : {
                name: "eye-off",
                onPress: () => togglePasswordVisibility("password"),
              }
        }
        onChangeText={setPassword}
        onBlur={validatePassword}
        value={password}
        secureTextEntry={!passwordVisibility.password}
        placeholder="Password"
        autoCapitalize="none"
        error={!!errors.password}
        errorMessage={errors.password}
        autoComplete="password"
      />
      <TextInput
        label="Confirm Password"
        leftIcon={{ name: "lock-closed" }}
        rightIcon={
          passwordVisibility.confirmPassword
            ? {
                name: "eye",
                onPress: () => togglePasswordVisibility("confirmPassword"),
              }
            : {
                name: "eye-off",
                onPress: () => togglePasswordVisibility("confirmPassword"),
              }
        }
        onChangeText={setConfirmPassword}
        onBlur={validateConfirmPassword}
        value={confirmPassword}
        secureTextEntry={!passwordVisibility.confirmPassword}
        placeholder="Confirm Password"
        autoCapitalize="none"
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        autoComplete="password"
      />
      <Button
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
    </>
  );
}
