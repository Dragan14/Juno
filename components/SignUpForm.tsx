import { useState } from "react";
import { Keyboard, ViewProps } from "react-native";
import {
  emailSchema,
  passwordSchema,
  nameSchema,
} from "@/schemas/auth-schemas";
import { useSignUp } from "@/api/useAuth";
import { z } from "zod";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useAlert } from "../context/AlertContext";
import { useToast } from "../context/ToastContext";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";

export default function SignUpForm({ style }: Pick<ViewProps, "style">) {
  const { showAlert, hideAlert } = useAlert();
  const { showToast } = useToast();

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
      try {
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
          showAlert({
            content: (
              <View style={{ gap: 10 }}>
                <Text>
                  Check your Email for a verification link to complete your sign
                  up.
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button
                    onPress={hideAlert}
                    variant="secondary"
                    outlined={true}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={hideAlert}
                    variant="primary"
                    style={{ flex: 1 }}
                  >
                    Confirm
                  </Button>
                </View>
              </View>
            ),
          });
        }
      } catch (error) {
        showToast({
          message:
            error instanceof Error
              ? error.message
              : "Failed to sign up. Please try again.",
          variant: "error",
        });
      }
    }
  };

  return (
    <View style={style}>
      <TextInput
        topLabel="Name"
        leftIcon={<CircleUser />}
        onChangeText={setName}
        onBlur={validateName}
        value={name}
        placeholder="Name"
        autoCapitalize="words"
        error={!!errors.name}
        errorMessage={errors.name}
        retainErrorMessageSpace={true}
        autoComplete="name"
      />
      <TextInput
        topLabel="Email"
        leftIcon={<Mail />}
        onChangeText={setEmail}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        error={!!errors.email}
        errorMessage={errors.email}
        retainErrorMessageSpace={true}
        autoComplete="email"
      />
      <TextInput
        topLabel="Password"
        leftIcon={<Lock />}
        rightIcon={
          passwordVisibility.password ? (
            <Eye onPress={() => togglePasswordVisibility("password")} />
          ) : (
            <EyeOff onPress={() => togglePasswordVisibility("password")} />
          )
        }
        onChangeText={setPassword}
        onBlur={validatePassword}
        value={password}
        secureTextEntry={!passwordVisibility.password}
        placeholder="Password"
        autoCapitalize="none"
        error={!!errors.password}
        errorMessage={errors.password}
        retainErrorMessageSpace={true}
        autoComplete="password-new"
      />
      <TextInput
        topLabel="Confirm Password"
        leftIcon={<Lock />}
        rightIcon={
          passwordVisibility.confirmPassword ? (
            <Eye onPress={() => togglePasswordVisibility("confirmPassword")} />
          ) : (
            <EyeOff
              onPress={() => togglePasswordVisibility("confirmPassword")}
            />
          )
        }
        onChangeText={setConfirmPassword}
        onBlur={validateConfirmPassword}
        value={confirmPassword}
        secureTextEntry={!passwordVisibility.confirmPassword}
        placeholder="Confirm Password"
        autoCapitalize="none"
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        retainErrorMessageSpace={true}
      />
      <Button
        disabled={signUp.isPending}
        onPress={handleSignUp}
        loading={signUp.isPending}
      >
        Sign Up
      </Button>
    </View>
  );
}
