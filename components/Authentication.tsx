import { useState, useCallback } from "react";
import { View, Keyboard } from "react-native";
import { emailSchema, passwordSchema } from "../schemas/validationSchemas";
import { useSignIn, useSignUp } from "../hooks/useAuth";
import { Button, TextInput, HelperText, Snackbar } from "react-native-paper";
import { z } from "zod";

export default function Authentication() {
  // Auth hooks
  const signIn = useSignIn();
  const signUp = useSignUp();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  // Handle sign in
  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      try {
        await signIn.mutateAsync({ email, password });
        setSnackbarMessage("Signed in successfully");
        setSnackbarVisible(true);
      } catch {
        setSnackbarMessage("Failed to sign in");
        setSnackbarVisible(true);
      }
    }
  };

  // Handle sign up
  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      try {
        await signUp.mutateAsync({ email, password });
        setSnackbarMessage("Signed up successfully");
        setSnackbarVisible(true);
      } catch {
        setSnackbarMessage("Failed to sign up");
        setSnackbarVisible(true);
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
        disabled={signIn.isPending || signUp.isPending}
        onPress={handleSignIn}
        loading={signIn.isPending}
      >
        Sign in
      </Button>
      <Button
        mode="contained"
        disabled={signIn.isPending || signUp.isPending}
        onPress={handleSignUp}
        loading={signUp.isPending}
      >
        Sign up
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
